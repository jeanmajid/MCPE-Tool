import chokidar from "chokidar";
import { FileHandler } from "./fileHandler.js";
import { ColorLogger } from "../cli/colorLogger.js";
import { ModuleManager } from "./moduleManager.js";
import { DEBUG } from "../../constants/dev.js";
import { BEHAVIOUR_PACK_PATH, IGNORE_PATHS, RESOURCE_PACK_PATH } from "../../constants/paths.js";
import { minimatch } from "minimatch";
import { LocalTransport } from "./transport/localTransport.js";
import { SftpTransport } from "./transport/sftpTransport.js";
import path from "path";
import { readConfig } from "../../utils/config.js";
import fs from "fs";

let cleanUpIsRunning = false;

export class Watcher {
    constructor(sourceDir, destDirBP, destDirRP) {
        this.watcher = null;
        const config = readConfig();
        if (config.remote && !config.remote.disabled) {
            if (!config.remote.targetPathBP || !config.remote.targetPathRP) {
                ColorLogger.error(
                    "Please specify the targetPathBP and targetPathRP in the remote config"
                );
                process.exit(0);
            }
            const keyPath = fs.existsSync(config.remote.privateKey)
                ? config.remote.privateKey
                : path.resolve(
                      process.env.HOME || process.env.USERPROFILE,
                      ".ssh",
                      config.remote.privateKey
                  );
            this.transport = new SftpTransport(
                {
                    host: config.remote.host,
                    username: config.remote.username,
                    privateKey: fs.readFileSync(keyPath) || undefined,
                    passphrase: config.remote.passphrase,
                    password: config.remote.password
                },
                config.remote.targetPathBP + "/" + config.name + "BP",
                config.remote.targetPathRP + "/" + config.name + "RP"
            );
            this.fileHandler = new FileHandler(
                sourceDir,
                this.transport.transportBP,
                this.transport.transportRP
            );
        } else {
            this.fileHandler = new FileHandler(
                sourceDir,
                new LocalTransport(destDirBP),
                new LocalTransport(destDirRP)
            );
        }
    }

    /**
     * Registers a module to the watcher.
     * @param {Object} module - The module to register.
     */
    registerModule(module) {
        this.modules.push(module);
    }

    async startWatching() {
        if (this.transport) {
            await this.transport.connect();
            ColorLogger.info("Succesfully connected to remote!");
        }
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

        const cleanUp = async () => {
            if (cleanUpIsRunning) return;
            cleanUpIsRunning = true;
            ColorLogger.delete("Cleaning up...");
            await this.fileHandler.removeDestinationDirectories();
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
