import path from "path";
import { loadDir } from "../../utils/files.js";
import { FileHandler } from "../filesystem/fileHandler.js";
import { PROJECT_PATH_SRC } from "../constants/paths.js";
import { BaseModule } from "./baseModule.js";

export class ModuleManager {
    static modules: BaseModule[] = [];

    static async loadAllModules(): Promise<void> {
        await Promise.all([
            loadDir(path.join(PROJECT_PATH_SRC, "modules")),
            loadDir(path.join(PROJECT_PATH_SRC, "customModules"))
        ]);
    }

    /**
     * Adds a module to the module registry with validation
     * @param module - The module configuration object
     * @throws {Error} When module name is missing, empty, or already exists
     * @example
     * ```typescript
     * ModuleManager.addModule({
     *   name: "MyModule",
     *   description: "A sample module that processes .mcfunction files",
     *   activator: (filePath) => filePath.endsWith('.mcfunction'),
     *   handleFile: (filePath) => ({
     *     newFilePath: filePath,
     *     fileData: "# Processed by MyModule\n" + fs.readFileSync(filePath, 'utf8')
     *   })
     * });
     * ```
     */
    static registerModule(module: BaseModule): void {
        if (!module.name) {
            throw new Error("No Name specified for module");
        }
        if (typeof module.name !== "string") {
            throw new Error("Module name must be a string");
        }
        if (module.name.trim() === "") {
            throw new Error("Module name cannot be empty");
        }
        if (this.checkIfModuleExists(module.name)) {
            throw new Error(`Module with name '${module.name}' already exists`);
        }
        if (!module.description) {
            throw new Error("No description specified for module");
        }

        this.modules.push(module);
    }

    static checkIfModuleExists(name: string): boolean {
        return this.modules.some((module) => module.name === name);
    }

    /**
     * Processes a file through the registered modules
     * @param filePath - The path of the file to process
     * @param fileHandler - The file handler to use
     */
    static async processFile(filePath: string, fileHandler: FileHandler): Promise<boolean> {
        let value = false;
        for (const module of this.modules) {
            if (module.activator?.(filePath)) {
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

    /**
     * Filters modules by name, processes their activator-handler pairs, and calls onLaunch for each module.
     *
     * @param modulesToAdd - Array of module names to include
     * @param bpPath - Path to the behavior pack directory
     * @param rpPath - Path to the resource pack directory
     */
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
                    if (pair.cancelFileTransfer === undefined) {
                        pair.cancelFileTransfer = module.cancelFileTransfer || false;
                    }
                }
                this.modules.push(...(module.activatorHandlerPairs as BaseModule[]));
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
