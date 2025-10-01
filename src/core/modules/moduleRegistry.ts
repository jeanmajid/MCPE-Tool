import { BaseAdapter } from "./adapters/baseAdapter.js";
import { JavaScriptAdapter } from "./adapters/javaScriptAdapter.js";
import { BaseModule } from "./baseModule.js";

type ModuleMetaData = {
    language: string;
};

export class ModuleRegistry {
    static async fetchModuleMetadata(name: string): Promise<ModuleMetaData> {
        // fetch
        return { language: "test" };
    }

    static async fetchModule(name: string, version?: string): Promise<string> {
        // download and return path
    }

    static async installModule(name: string, language: string): Promise<BaseModule> {
        const metadata = await this.fetchModuleMetadata(name);
        const modulePath = await this.fetchModule(name, metadata.version);
    }
}
