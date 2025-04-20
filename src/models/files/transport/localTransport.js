import { Transport } from "./transport.js";
import fs from "fs";
import path from "path";
import { ensureDirSync, removeSync } from "../../../utils/files.js";

export class LocalTransport extends Transport {
    /**
     * @param {string} destPath base local path (will be prefixed to all ops)
     */
    constructor(destPath) {
        super();
        this.destPath = destPath.replace(/[\\\/]$/, "");
    }

    async ensureDir(dirRel) {
        ensureDirSync(path.join(this.destPath, dirRel));
    }

    async writeFile(fileRel, contents) {
        const pathTo = path.join(this.destPath, fileRel);
        ensureDirSync(path.dirname(pathTo));
        fs.writeFileSync(pathTo, contents);
    }

    async copyFile(srcPath, fileRel) {
        const pathTo = path.join(this.destPath, fileRel);
        ensureDirSync(path.dirname(pathTo));
        fs.copyFileSync(srcPath, pathTo);
    }

    async deleteFile(fileRel) {
        const pathTo = path.join(this.destPath, fileRel);
        removeSync(pathTo);
    }
}
