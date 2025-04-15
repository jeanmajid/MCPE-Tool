const chokidar = require("chokidar");
const { FileHandler } = require("./fileHandler");
const { ColorLogger } = require("../cli/colorLogger");
const { ModuleManager } = require("./moduleManager");
import { DEBUG } from "../../constants/dev";
import { BEHAVIOUR_PACK_PATH, IGNORE_PATHS, RESOURCE_PACK_PATH } from "../../constants/paths";
import { minimatch } from "minimatch";
const fs = require("fs");

let cleanUpIsRunning = false;

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

        const bpFolder = BEHAVIOUR_PACK_PATH;
        const rpFolder = RESOURCE_PACK_PATH;

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
            ignored: (filePath) => {
                return IGNORE_PATHS.some((pattern) => minimatch(filePath, pattern, { dot: true }));
            }
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
            if (cleanUpIsRunning) return;
            cleanUpIsRunning = true;
            ColorLogger.delete("Cleaning up...");
            this.fileHandler.removeDestinationDirectories();
            for (const module of ModuleManager.modules) {
                if (module.onExit) module.onExit();
            }
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
