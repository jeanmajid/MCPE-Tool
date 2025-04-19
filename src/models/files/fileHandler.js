const fs = require("node:fs");
const path = require("node:path");
const { ColorLogger } = require("../cli/colorLogger");
const { ModuleManager } = require("./moduleManager");
const { ensureDirSync, removeSync } = require("../../utils/files");
const { BEHAVIOUR_PACK_PATH, RESOURCE_PACK_PATH } = require("../../constants/paths");
const Transport = require("./transport/transport");

/**
 * Represents a file handler that performs file operations such as copying, deleting, and refreshing directories.
 */
class FileHandler {
    /**
     * Creates a new instance of the FileHandler class.
     * @param {string} sourceDir
     * @param {Transport} transportBP 
     * @param {Transport} transportRP
     */
    constructor(sourceDir, transportBP, transportRP) {
        this.sourceDir = sourceDir;
        this.transportBP = transportBP;
        this.transportRP = transportRP;
    }

    isBP(path) {
        return path.includes(BEHAVIOUR_PACK_PATH.replace("./", "").replaceAll("/", "\\") + "\\");
    }

    /**
     * Copies a file from the source directory to the destination directory.
     * @param {string} filePath - The path of the file to be copied.
     */
    async copyFile(filePath) {
        const isBP = this.isBP(filePath);
        const relativePath = path.relative(this.sourceDir, filePath);
        const transport = isBP ? this.transportBP : this.transportRP;
        const pathTo = relativePath.slice(isBP ? BEHAVIOUR_PACK_PATH.length - 2 : RESOURCE_PACK_PATH.length - 2);
        try {
            await transport.copyFile(filePath, pathTo)
            ColorLogger.success(`Copied: ${filePath} ➔ ${pathTo}`);
        } catch (err) {
            ColorLogger.error(`Copy failed: ${filePath} ➔ ${pathTo} | ${err}`);
        }
    }

    /**
     * Writes a new file to the destination directory.
     * @param {string} filePath - The path of the file to be written.
     * @param {string} newFile - The new file content.
     */
    async writeFile(filePath, newFile) {
        const isBP = this.isBP(filePath);
        const relativePath = path.relative(this.sourceDir, filePath);
        const transport = isBP ? this.transportBP : this.transportRP;
        const pathTo = relativePath.slice(isBP ? BEHAVIOUR_PACK_PATH.length - 2 : RESOURCE_PACK_PATH.length - 2);
        try {
            transport.writeFile(pathTo, newFile);
            ColorLogger.success(`Updated: ${pathTo}`);
        } catch (err) {
            ColorLogger.error(`Update failed: ${pathTo} | ${err}`);
        }
    }

    /**
     * Deletes a file from the destination directory.
     * @param {string} filePath - The path of the file to be deleted.
     */
    async deleteFile(filePath) {
        const isBP = this.isBP(filePath);
        const relativePath = path.relative(this.sourceDir, filePath);
        const transport = isBP ? this.transportBP : this.transportRP;
        const pathTo = relativePath.slice(isBP ? BEHAVIOUR_PACK_PATH.length - 2 : RESOURCE_PACK_PATH.length - 2);
        try {
            transport.deleteFile(pathTo);
            ColorLogger.delete(`Removed: ${pathTo}`);
        } catch (err) {
            ColorLogger.error(`Remove failed: ${pathTo} | ${err}`);
        }
    }

    async removeDestinationDirectories() {
        await this.transportBP.deleteFile(".")
        await this.transportRP.deleteFile(".")
    }
}

module.exports = {
    FileHandler,
};
