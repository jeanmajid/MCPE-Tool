const Transport = require("./transport");
const SftpClient = require("ssh2-sftp-client");
const path = require("path");

class SftpTransport extends Transport {
    /**
     * @param {import('ssh2').ConnectConfig} config ssh2‑sftp‑client connect config
     * @param {string} targetPathBP
     * @param {string} targetPathRP
     */
    constructor(config, targetPathBP, targetPathRP) {
        super();
        this.client = new SftpClient();
        this.client.client.setMaxListeners(0);
        this.config = config;

        this.transportBP = new SftpSubTransport(this.client, targetPathBP.replace(/[\\\/]$/, ""));
        this.transportRP = new SftpSubTransport(this.client, targetPathRP.replace(/[\\\/]$/, ""));
    }

    async connect() {
        await this.client.connect(this.config);
    }
    async end() {
        await this.client.end();
    }
}

class SftpSubTransport extends Transport {
    /**
     * @param {SftpClient} client ssh2‑sftp‑client
     * @param {string} destPath base remote path (will be prefixed to all operations)
     */
    constructor(client, destPath) {
        super();
        this.client = client;
        this.destPath = destPath;
    }
    /**
     * Recursively ensure remote directory exists.
     * @param {string} dirRel  – directory path relative to base destPath
     */
    async ensureDir(dirRel) {
        const relPosix = dirRel.replace(/\\/g, "/");
        const full = path.posix.join(this.destPath, relPosix);
        const parts = full.split("/");
        let cur = "";
        for (const p of parts) {
            if (!p) continue;
            cur += `/${p}`;
            try {
                await this.client.mkdir(cur);
            } catch {}
        }
    }

    /**
     * Write a file to the remote.
     * @param {string} fileRel – file path relative to base destPath
     * @param {Buffer|string} contents
     */
    async writeFile(fileRel, contents) {
        const relPosix = fileRel.replace(/\\/g, "/");
        const remote = path.posix.join(this.destPath, relPosix);

        const dirPosix = path.posix.dirname(relPosix);
        await this.ensureDir(dirPosix);

        await this.client.put(Buffer.isBuffer(contents) ? contents : Buffer.from(contents), remote);
    }

    /**
     * Copy a local file up to remote.
     * @param {string} srcPath – local absolute path
     * @param {string} fileRel – remote path relative to base destPath
     */
    async copyFile(srcPath, fileRel) {
        const relPosix = fileRel.replace(/\\/g, "/");
        const remote = path.posix.join(this.destPath, relPosix);

        const dirPosix = path.posix.dirname(relPosix);
        await this.ensureDir(dirPosix);

        await this.client.fastPut(srcPath, remote);
    }

    /**
     * Delete a file or directory on remote.
     * @param {string} fileRel – path relative to base destPath
     */
    async deleteFile(fileRel) {
        await this.removeSync(fileRel);
    }

    /**
     * Recursively remove file or directory on remote SFTP.
     * @param {string} targetRel – path relative to base destPath
     */
    async removeSync(targetRel) {
        const relPosix = targetRel.replace(/\\/g, "/");
        const full = path.posix.join(this.destPath, relPosix);
        const exists = await this.client.exists(full);
        if (!exists) return;

        if (exists === "d") {
            const list = await this.client.list(full);
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

module.exports = SftpTransport;
