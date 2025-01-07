const chokidar = require("chokidar");
const { FileHandler } = require("./fileHandler");
const { ColorLogger } = require("../cli/colorLogger");
const { ModuleManager } = require("./moduleManager");
import { DEBUG } from "../../constants/dev";
import { IGNORE_PATHS } from "../../constants/paths";
const fs = require("fs");

class Watcher {
    constructor(sourceDir, destDirBP, destDirRP) {
        this.watcher = null;
        this.fileHandler = new FileHandler(sourceDir, destDirBP, destDirRP);
    }

    /**
     * Registers a module to the watcher.
     * @param {Object} module - The module to register.
     */
    registerModule(module) {
        this.modules.push(module);
    }

    async refresh() {
        await this.fileHandler.refreshDir();
    }

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

        this.watcher = chokidar.watch(watchFolders, {
            ignored: IGNORE_PATHS,
        });

        const handleFileEvent = async (filePath, event) => {
            if (event === "unlink") {
                await this.fileHandler.deleteFile(filePath);
                return;
            }

            const shouldCancel = await ModuleManager.processFile(filePath, this.fileHandler);

            if (shouldCancel) return;

            if (event === "add" || event === "change") {
                await this.fileHandler.copyFile(filePath);
            }
        };

        this.watcher
            .on("add", (filePath) => handleFileEvent(filePath, "add"))
            .on("change", (filePath) => handleFileEvent(filePath, "change"))
            .on("unlink", (filePath) => handleFileEvent(filePath, "unlink"))
            .on("error", (error) => console.error(`Watcher error: ${error}`));

        ColorLogger.info("Watching for file changes...");

        const cleanUp = () => {
            ColorLogger.delete("Cleaning up...");
            this.fileHandler.removeDestinationDirectories();
            process.exit(0);
        };

        if (!DEBUG) {
            process.on("exit", cleanUp);
            process.on("SIGINT", cleanUp);
            process.on("uncaughtException", cleanUp);
        }
    }

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
