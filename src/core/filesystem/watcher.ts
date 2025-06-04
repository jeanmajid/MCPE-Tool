import { DEBUG } from "./../constants/dev";
import chokidar, { FSWatcher } from "chokidar";
import { FileHandler } from "./fileHandler";
import { BEHAVIOUR_PACK_PATH, IGNORE_PATHS, RESOURCE_PACK_PATH } from "./../constants/paths";
import { minimatch } from "minimatch";
import { LocalTransport } from "./transport/localTransport";
import { SftpTransport } from "./transport/sftpTransport";
import path from "path";
import fs from "fs";
import { Logger } from "../logger/logger";
import { ConfigManager } from "../config/configManager";
import { ModuleManager } from "../modules/moduleManager";

let cleanUpIsRunning = false;

export class Watcher {
    private watcher: FSWatcher | null;
    private fileHandler: FileHandler;
    private transport?: SftpTransport;

    constructor(sourceDir: string, destDirBP: string, destDirRP: string) {
        this.watcher = null;
        const config = ConfigManager.readConfig();
        if (config.remote && !config.remote.disabled) {
            if (!config.remote.targetPathBP || !config.remote.targetPathRP) {
                Logger.error(
                    "Please specify the targetPathBP and targetPathRP in the remote config"
                );
                process.exit(0);
            }
            const keyPath = fs.existsSync(config.remote.privateKey)
                ? config.remote.privateKey
                : path.resolve(
                      process.env.HOME || process.env.USERPROFILE || "",
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

    async startWatching(): Promise<void> {
        if (this.transport) {
            await this.transport.connect();
            Logger.info("Succesfully connected to remote!");
        }
        const watchFolders: string[] = [];

        const bpFolder = BEHAVIOUR_PACK_PATH;
        const rpFolder = RESOURCE_PACK_PATH;

        if (fs.existsSync(bpFolder)) {
            watchFolders.push(bpFolder);
        }

        if (fs.existsSync(rpFolder)) {
            watchFolders.push(rpFolder);
        }

        if (watchFolders.length === 0) {
            Logger.error("No BP or RP folder found. Exiting...");
            return;
        }

        this.watcher = chokidar.watch(watchFolders, {
            ignored: (filePath: string) => {
                return IGNORE_PATHS.some((pattern) => minimatch(filePath, pattern, { dot: true }));
            }
        });

        const handleFileEvent = async (filePath: string, event: string): Promise<void> => {
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
            .on("add", (filePath: string) => handleFileEvent(filePath, "add"))
            .on("change", (filePath: string) => handleFileEvent(filePath, "change"))
            .on("unlink", (filePath: string) => handleFileEvent(filePath, "unlink"))
            .on("error", (error: unknown) => console.error(`Watcher error: ${error}`));

        Logger.info("Watching for file changes...");

        const cleanUp = async (): Promise<void> => {
            if (cleanUpIsRunning) return;
            cleanUpIsRunning = true;
            Logger.delete("Cleaning up...");
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

    stopWatching(): void {
        if (this.watcher) {
            try {
                this.watcher.close();
                this.watcher = null;
            } catch (error) {
                Logger.error(`Error stopping the watcher: ${error}`);
            }
        } else {
            Logger.error("Watcher is not running.");
        }
    }
}
