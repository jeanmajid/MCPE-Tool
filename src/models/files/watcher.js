const chokidar = require("chokidar");
const { FileHandler } = require("./fileHandler");
const { ColorLogger } = require("../cli/colorLogger");
const fs = require("fs-extra");

/**
 * Represents a file watcher that monitors changes in a source directory and performs corresponding actions.
 */
class Watcher {
    /**
     * Creates a new instance of the Watcher class.
     * @param {string} sourceDir - The source directory to watch for file changes.
     * @param {string} destDirBP - The destination directory for BP files.
     * @param {string} destDirRP - The destination directory for RP files.
     */
    constructor(sourceDir, destDirBP, destDirRP) {
        this.watcher = null;
        this.fileHandler = new FileHandler(sourceDir, destDirBP, destDirRP);
    }

    /**
     * Initializes the watcher by refreshing the source directory and starting the file watching process.
     * @returns {Promise<void>} A promise that resolves when the watcher is initialized.
     */
    async refresh() {
        await this.fileHandler.refreshDir();
    }

    /**
     * Starts watching for file changes in the source directory.
     */
    startWatching() {
        this.refresh();

        const watchFolders = [];

        const bpFolder = `${this.fileHandler.sourceDir}/BP`;
        const rpFolder = `${this.fileHandler.sourceDir}/RP`;

        if (fs.existsSync(bpFolder)) {
            watchFolders.push(bpFolder);
        }

        if (fs.existsSync(rpFolder)) {
            watchFolders.push(rpFolder);
        }

        if (watchFolders.length === 0) {
            ColorLogger.error("No BP or RP folder found. Exiting...");
            return;
        }

        this.watcher = chokidar.watch(watchFolders, { ignored: ["**/node_modules/**", "**/.git/**", "**/.vscode/**", "**/.gitignore", "**/package.json", "**/package-lock.json", "**/*.md"] });

        this.watcher
            .on("add", (filePath) => this.fileHandler.copyFile(filePath))
            .on("change", (filePath) => this.fileHandler.copyFile(filePath))
            .on("unlink", (filePath) => this.fileHandler.deleteFile(filePath))
            .on("error", (error) => console.error(`Watcher error: ${error}`));

        ColorLogger.info("Watching for file changes...");

        const cleanUp = () => {
            this.fileHandler.removeDestinationDirectories();
            process.exit(0);
        };

        process.on("exit", cleanUp);
        process.on("SIGINT", cleanUp);
        process.on("uncaughtException", cleanUp);
    }

    /**
     * Stops watching for file changes in the source directory.
     */
    stopWatching() {
        if (this.watcher) {
            try {
                this.watcher.close();
                this.watcher = null;
            } catch (error) {
                ColorLogger.error(`Error stopping the watcher: ${error}`);
            }
        } else {
            ColorLogger.error("Watcher is not running.");
        }
    }
}

module.exports = {
    Watcher,
};
