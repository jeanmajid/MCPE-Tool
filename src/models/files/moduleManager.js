/**@import { Module, ActivatorHandlerPair } from "./module" */
import path from "path";
import { loadDir } from "../../utils/files.js";
import { PROJECT_PATH_SRC } from "../../constants/paths.js";

export class ModuleManager {
    /**
     * @type {Module[]}
     */
    static modules = [];

    static async loadAllModules() {
        await Promise.all([loadDir(path.join(PROJECT_PATH_SRC, "modules")), loadDir("./plugins")]);
    }

    /**
     * Registers a new module
     * @param {Module} data - The module to register
     */
    static addModule(data) {
        if (!data.name) throw new Error("No Name specified for module");
        this.modules.push(data);
    }

    static checkIfModuleExists(name) {
        return this.modules.some((module) => module.name === name);
    }

    /**
     * Processes a file through the registered modules
     * @param {string} filePath - The path of the file to process
     * @param {import("../files/fileHandler").FileHandler} fileHandler - The file handler to use
     */
    static async processFile(filePath, fileHandler) {
        let value = false;
        for (const module of this.modules) {
            if (module.activator(filePath)) {
                let data = {};
                if (module.handleFile) data = module.handleFile(filePath);
                if (module.cancelFileTransfer) {
                    if (data?.fileData !== undefined) {
                        await fileHandler.writeFile(data.newFilePath || filePath, data.fileData);
                    }
                    value = true;
                }
            }
        }
        return value;
    }

    static async filterModules(modulesToAdd, bpPath, rpPath) {
        this.modules = this.modules.filter((module) => modulesToAdd.includes(module.name));

        for (const module of this.modules) {
            if (module.activatorHandlerPairs) {
                for (let i = 0; i < module.activatorHandlerPairs.length; i++) {
                    const pair = module.activatorHandlerPairs[i];
                    if (!pair.activator) {
                        module.activatorHandlerPairs.splice(i, 1);
                        continue;
                    }
                    if (pair.cancelFileTransfer === undefined)
                        pair.cancelFileTransfer = module.cancelFileTransfer || false;
                }
                this.modules.push(...module.activatorHandlerPairs);
            }
        }

        for (const module of this.modules) {
            if (module.onLaunch) {
                await module.onLaunch(bpPath, rpPath);
            }
            if (!module.activator) {
                this.modules = this.modules.filter((m) => m.name !== module.name);
            }
        }
    }
}
