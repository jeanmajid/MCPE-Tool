import { rm } from "fs/promises";
import fs from "node:fs";
import path from "node:path";

import { ensureDirSync } from "../../../utils/files.js";
import { Transport } from "./transport.js";

export class LocalTransport implements Transport {
    private destPath: string;

    /**
     * @param destPath base local path (will be prefixed to all ops)
     */
    public constructor(destPath: string) {
        this.destPath = destPath.replace(/[\\/]$/, "");
    }

    public async ensureDir(dirRelative: string): Promise<void> {
        ensureDirSync(path.join(this.destPath, dirRelative));
    }

    public async writeFile(fileRelative: string, contents: string | Buffer): Promise<void> {
        const pathTo = path.join(this.destPath, fileRelative);
        ensureDirSync(path.dirname(pathTo));
        fs.writeFileSync(pathTo, contents);
    }

    public async copyFile(srcPath: string, fileRelative: string): Promise<void> {
        const pathTo = path.join(this.destPath, fileRelative);
        ensureDirSync(path.dirname(pathTo));
        fs.copyFileSync(srcPath, pathTo);
    }

    public async deleteFile(fileRelative: string): Promise<void> {
        const pathTo = path.join(this.destPath, fileRelative);
        if (fs.existsSync(pathTo)) {
            await rm(pathTo, { recursive: true });
        }
    }
}
