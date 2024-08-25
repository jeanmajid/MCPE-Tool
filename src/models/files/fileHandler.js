const fs = require("fs-extra");
const path = require("path");
const { ColorLogger } = require("../cli/colorLogger");

class FileHandler {
    constructor(sourceDir, destDirBP, destDirRP) {
        this.sourceDir = sourceDir;
        this.destDirBP = destDirBP;
        this.destDirRP = destDirRP;
    }

    async copyFile(filePath) {
        const isBP = filePath.includes("BP\\");
        const relativePath = path.relative(this.sourceDir, filePath);
        const destPath = path.join(isBP ? this.destDirBP : this.destDirRP, relativePath.slice(3));
        try {
            await fs.promises.copyFile(filePath, destPath);
            ColorLogger.success(`Copied: ${filePath} ➔ ${destPath}`);
        } catch (err) {
            ColorLogger.error(`Copy failed: ${filePath} ➔ ${destPath} | ${err}`);
        }
    }

    async deleteFile(filePath) {
        const isBP = filePath.includes("BP\\");
        const relativePath = path.relative(this.sourceDir, filePath);
        const destPath = path.join(isBP ? this.destDirBP : this.destDirRP, relativePath.slice(3));
        try {
            await fs.promises.unlink(destPath);
            ColorLogger.delete(`Removed: ${destPath}`);
        } catch (err) {
            ColorLogger.error(`Remove failed: ${destPath} | ${err}`);
        }
    }

    async refreshDir() {
        try {
            this.removeDestinationDirectories();
            ColorLogger.info(`Cleared: ${this.destDirBP} & ${this.destDirRP}`);
            await fs.promises.mkdir(this.destDirBP, { recursive: true });
            await fs.promises.mkdir(this.destDirRP, { recursive: true });
            ColorLogger.info(`Recreated: ${this.destDirBP} & ${this.destDirRP}`);
            await fs.promises.copyFile(this.sourceDir + "/BP", this.destDirBP);
            await fs.promises.copyFile(this.sourceDir + "/RP", this.destDirRP);
            ColorLogger.success(`Refreshed: ${this.sourceDir} ➔ ${this.destDirBP} & ${this.destDirRP}`);
        } catch (err) {
            ColorLogger.error(`Refresh failed | ${err}`);
        }
    }

    removeDestinationDirectories() {
        if (fs.existsSync(this.destDirBP)) {
            fs.rmSync(this.destDirBP, { recursive: true, force: true });
        }
        if (fs.existsSync(this.destDirRP)) {
            fs.rmSync(this.destDirRP, { recursive: true, force: true });
        }
    }
}

module.exports = {
    FileHandler,
};
