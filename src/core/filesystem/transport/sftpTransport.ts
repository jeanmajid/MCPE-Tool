// !Will be removed in the future, probably, not sure. Theres basically no use case for this and it doesnt support the modules.

import { Transport } from "./transport.js";
import SftpClient from "ssh2-sftp-client";
import path from "path";

interface SftpConfig {
    host: string;
    port?: number;
    username: string;
    password?: string;
    privateKey?: string | Buffer;
    passphrase?: string;
    [key: string]: unknown;
}

export class SftpTransport {
    private client: SftpClient;
    private config: SftpConfig;
    public transportBP: SftpSubTransport;
    public transportRP: SftpSubTransport;

    constructor(config: SftpConfig, targetPathBP: string, targetPathRP: string) {
        this.client = new SftpClient();
        // @ts-expect-error The types are stupid here
        this.client.client.setMaxListeners(0);
        this.config = config;

        this.transportBP = new SftpSubTransport(this.client, targetPathBP.replace(/[\\/]$/, ""));
        this.transportRP = new SftpSubTransport(this.client, targetPathRP.replace(/[\\/]$/, ""));
    }

    async connect(): Promise<void> {
        await this.client.connect(this.config);
    }

    async end(): Promise<void> {
        await this.client.end();
    }
}

class SftpSubTransport implements Transport {
    private client: SftpClient;
    private destPath: string;

    constructor(client: SftpClient, destPath: string) {
        this.client = client;
        this.destPath = destPath;
    }

    async ensureDir(dirRel: string): Promise<void> {
        const relPosix = dirRel.replace(/\\/g, "/");
        const full = path.posix.join(this.destPath, relPosix);
        const parts = full.split("/");
        let cur = "";
        for (const p of parts) {
            if (!p) continue;
            cur += `/${p}`;
            try {
                await this.client.mkdir(cur);
            } catch {
                // Directory already exists or creation failed, continue
            }
        }
    }

    async writeFile(fileRel: string, contents: Buffer | string): Promise<void> {
        const relPosix = fileRel.replace(/\\/g, "/");
        const remote = path.posix.join(this.destPath, relPosix);

        const dirPosix = path.posix.dirname(relPosix);
        await this.ensureDir(dirPosix);

        await this.client.put(Buffer.isBuffer(contents) ? contents : Buffer.from(contents), remote);
    }

    async copyFile(srcPath: string, fileRel: string): Promise<void> {
        const relPosix = fileRel.replace(/\\/g, "/");
        const remote = path.posix.join(this.destPath, relPosix);

        const dirPosix = path.posix.dirname(relPosix);
        await this.ensureDir(dirPosix);

        await this.client.fastPut(srcPath, remote);
    }

    async deleteFile(fileRel: string): Promise<void> {
        await this.removeSync(fileRel);
    }

    async removeSync(targetRel: string): Promise<void> {
        const relPosix = targetRel.replace(/\\/g, "/");
        const full = path.posix.join(this.destPath, relPosix);
        const exists = await this.client.exists(full);
        if (!exists) return;

        if (exists === "d") {
            const list = await this.client.list(full, () => true);
            for (const item of list) {
                const childRel = path.posix.join(relPosix, item.name);
                await this.removeSync(childRel);
            }
            await this.client.rmdir(full);
        } else {
            await this.client.delete(full);
        }
    }
}
