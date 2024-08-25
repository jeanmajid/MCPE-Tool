const fs = require("fs-extra");
const path = require("path");
const { ColorLogger } = require("../cli/colorLogger");

/**
 * Represents a file handler that performs file operations such as copying, deleting, and refreshing directories.
 */
class FileHandler {
    /**
     * Creates a new instance of the FileHandler class.
     * @param {string} sourceDir - The source directory.
     * @param {string} destDirBP - The destination directory for BP files.
     * @param {string} destDirRP - The destination directory for RP files.
     */
    constructor(sourceDir, destDirBP, destDirRP) {
        this.sourceDir = sourceDir;
        this.destDirBP = destDirBP;
        this.destDirRP = destDirRP;
    }

    /**
     * Copies a file from the source directory to the destination directory.
     * @param {string} filePath - The path of the file to be copied.
     */
    async copyFile(filePath) {
        const isBP = filePath.includes("BP\\");
        const relativePath = path.relative(this.sourceDir, filePath);
        const destPath = path.join(isBP ? this.destDirBP : this.destDirRP, relativePath.slice(3));
        try {
            await fs.copy(filePath, destPath);
            ColorLogger.success(`Copied: ${filePath} ➔ ${destPath}`);
        } catch (err) {
            ColorLogger.error(`Copy failed: ${filePath} ➔ ${destPath} | ${err}`);
        }
    }

    /**
     * Deletes a file from the destination directory.
     * @param {string} filePath - The path of the file to be deleted.
     */
    async deleteFile(filePath) {
        const isBP = filePath.includes("BP\\");
        const relativePath = path.relative(this.sourceDir, filePath);
        const destPath = path.join(isBP ? this.destDirBP : this.destDirRP, relativePath.slice(3));
        try {
            await fs.remove(destPath);
            ColorLogger.delete(`Removed: ${destPath}`);
        } catch (err) {
            ColorLogger.error(`Remove failed: ${destPath} | ${err}`);
        }
    }

    /**
     * Refreshes the destination directories by clearing them and copying files from the source directory.
     */
    async refreshDir() {
        try {
            this.removeDestinationDirectories();
            ColorLogger.info(`Cleared: ${this.destDirBP} & ${this.destDirRP}`);
            await fs.ensureDir(this.destDirBP);
            await fs.ensureDir(this.destDirRP);
            ColorLogger.info(`Recreated: ${this.destDirBP} & ${this.destDirRP}`);
            await fs.copy(this.sourceDir + "/BP", this.destDirBP);
            await fs.copy(this.sourceDir + "/RP", this.destDirRP);
            ColorLogger.success(`Refreshed: ${this.sourceDir} ➔ ${this.destDirBP} & ${this.destDirRP}`);
        } catch (err) {
            ColorLogger.error(`Refresh failed | ${err}`);
        }
    }

    removeDestinationDirectories() {
        fs.removeSync(this.destDirBP, { recursive: true });
        fs.removeSync(this.destDirRP, { recursive: true });
    }
}

module.exports = {
    FileHandler,
};
