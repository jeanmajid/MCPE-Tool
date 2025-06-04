import { Transport } from "./transport.js";
import fs from "fs";
import path from "path";
import { ensureDirSync, removeSync } from "../../../utils/files.js";

export class LocalTransport implements Transport {
    private destPath: string;

    /**
     * @param destPath base local path (will be prefixed to all ops)
     */
    constructor(destPath: string) {
        this.destPath = destPath.replace(/[\\/]$/, "");
    }

    async ensureDir(dirRelative: string): Promise<void> {
        ensureDirSync(path.join(this.destPath, dirRelative));
    }

    async writeFile(fileRelative: string, contents: string | Buffer): Promise<void> {
        const pathTo = path.join(this.destPath, fileRelative);
        ensureDirSync(path.dirname(pathTo));
        fs.writeFileSync(pathTo, contents);
    }

    async copyFile(srcPath: string, fileRelative: string): Promise<void> {
        const pathTo = path.join(this.destPath, fileRelative);
        ensureDirSync(path.dirname(pathTo));
        fs.copyFileSync(srcPath, pathTo);
    }

    async deleteFile(fileRelative: string): Promise<void> {
        const pathTo = path.join(this.destPath, fileRelative);
        removeSync(pathTo);
    }
}
