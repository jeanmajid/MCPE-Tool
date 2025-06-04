import path from "path";
import { loadDir } from "../../utils/files.js";
import { FileHandler } from "../filesystem/fileHandler.js";
import { PROJECT_PATH_SRC } from "../constants/paths.js";

type ActivatorHandlerPair = {
    activator: (filePath: string) => boolean;
    handleFile: (filePath: string) => {
        newFilePath: string | undefined;
        fileData: string | undefined;
    };
    cancelFileTransfer: boolean;
};

export type Module = {
    name: string;
    description: string;
    cancelFileTransfer?: boolean;
    activator?: (filePath: string) => boolean;
    handleFile?: (filePath: string) => {
        newFilePath: string | undefined;
        fileData: string | undefined;
    };
    onLaunch?: (bpPath?: string, rpPath?: string) => Promise<void> | void;
    activatorHandlerPairs?: ActivatorHandlerPair[];
    onExit?: () => void;
};

export class ModuleManager {
    static modules: Module[] = [];

    static async loadAllModules(): Promise<void> {
        await Promise.all([loadDir(path.join(PROJECT_PATH_SRC, "modules")), loadDir("./plugins")]);
    }

    static addModule(data: Module): void {
        if (!data.name) throw new Error("No Name specified for module");
        this.modules.push(data);
    }

    static checkIfModuleExists(name: string): boolean {
        return this.modules.some((module) => module.name === name);
    }

    /**
     * Processes a file through the registered modules
     * @param {string} filePath - The path of the file to process
     * @param {import("../../../srcOLD/models/files/fileHandler.js").FileHandler} fileHandler - The file handler to use
     */
    static async processFile(filePath: string, fileHandler: FileHandler): Promise<boolean> {
        let value = false;
        for (const module of this.modules) {
            if (module.activator && module.activator(filePath)) {
                const { fileData, newFilePath } = module.handleFile
                    ? module.handleFile(filePath)
                    : {};
                if (module.cancelFileTransfer) {
                    if (fileData !== undefined) {
                        await fileHandler.writeFile(newFilePath || filePath, fileData);
                    }
                    value = true;
                }
            }
        }
        return value;
    }

    static async filterModules(
        modulesToAdd: string[],
        bpPath: string,
        rpPath: string
    ): Promise<void> {
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
                this.modules.push(...(module.activatorHandlerPairs as Module[]));
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
