const fs = require("fs");
const path = require("path");
const { ColorLogger } = require("../cli/colorLogger");
const { ModuleManager } = require("./moduleManager");
const { ensureDirSync, removeSync } = require("../../utils/files");

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
            ensureDirSync(path.dirname(destPath));
            fs.copyFileSync(filePath, destPath);
            ColorLogger.success(`Copied: ${filePath} ➔ ${destPath}`);
        } catch (err) {
            ColorLogger.error(`Copy failed: ${filePath} ➔ ${destPath} | ${err}`);
        }
    }

    /**
     * Writes a new file to the destination directory.
     * @param {string} filePath - The path of the file to be written.
     * @param {string} newFile - The new file content.
     */
    async writeFile(filePath, newFile) {
        const isBP = filePath.includes("BP\\");
        const relativePath = path.relative(this.sourceDir, filePath);
        const destPath = path.join(isBP ? this.destDirBP : this.destDirRP, relativePath.slice(3));
        try {
            ensureDirSync(path.dirname(destPath));
            fs.writeFileSync(destPath, newFile);
            ColorLogger.success(`Updated: ${destPath}`);
        } catch (err) {
            ColorLogger.error(`Update failed: ${destPath} | ${err}`);
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
            removeSync(destPath);
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
            ensureDirSync(this.destDirBP);
            ensureDirSync(this.destDirRP);
            ColorLogger.info(`Recreated: ${this.destDirBP} & ${this.destDirRP}`);
            for (const file of fs.readdirSync(this.sourceDir)) {
                if (file === "config.json" || file === "BP" || file === "RP") continue;
                const shouldCancel = await ModuleManager.processFile(file, this.fileHandler);
                if (shouldCancel) continue;
                this.copyFile(file);
            }
            ColorLogger.success(`Refreshed: ${this.sourceDir} ➔ ${this.destDirBP} & ${this.destDirRP}`);
        } catch (err) {
            ColorLogger.error(`Refresh failed | ${err}`);
        }
    }

    removeDestinationDirectories() {
        removeSync(this.destDirBP, { recursive: true });
        removeSync(this.destDirRP, { recursive: true });
    }
}

module.exports = {
    FileHandler,
};
