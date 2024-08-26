/**
 * @typedef {Object} Module
 * @property {String} name - The name of the module
 * @property {String} description - The description of the module
 * @property {boolean} cancelFileTransfer - Whether the module should cancel the file transfer
 * @property {(filePath: string) => void} activator - The function to check if the module should activate
 * @property {(filePath: string) => { newFilePath: string | undefined, fileData: string | undefined}} handleFile - The function to handle the file
 * @property {(filePath: string) => Promise<void>} onLaunch - The function to run when the module is launched
 */

/**
 * Manages the modules
*/
class ModuleManager {
    /**
     * @type {Module[]}
     */
    static modules = [];

    /**
     * Registers a new module
     * @param {Module} data - The module to register
     */
    static addModule(data) {
        if (!data.name) throw new Error("No Name specified for module");
        this.modules.push(data);
    }

    static checkIfModuleExists(name) {
        return this.modules.some(module => module.name === name);
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
                const data = module.handleFile(filePath);
                if (module.cancelFileTransfer) {
                    if (data.fileData !== undefined) {
                        await fileHandler.writeFile(data.newFilePath || filePath, data.fileData);
                    }
                    value = true;
                }
            }
        }
        return value;
    }
}

module.exports = {
    ModuleManager
};
