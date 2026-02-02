import fs from "fs";

export interface Config {
    $schema: string;
    /** The name of the project */
    name: string;
    /** The description of the project */
    description: string;
    /** The modules of the project */
    modules: string[];
    /** The ID of the project */
    id: string;
    /** The Path to the Resource Pack */
    resourcePackPath?: string;
    /** The Path to the Behaviour Pack */
    behaviourPackPath?: string;
    /** Output target environment */
    output?: "stable" | "preview" | "stable_uwp" | "preview_uwp";
    /** Wait for file write completion before transfer */
    awaitWriteFinish?: {
        /** Time in ms for file size to remain constant before considering it finished */
        stabilityThreshold: number;
        /** Interval in ms to check file size */
        pollInterval: number;
    };
}

export class ConfigManager {
    static configPath: string = "./config.json";
    static cache: Config | null = null;

    /**
     * Reads the configuration from the config file.
     * If the file doesn't exist or is empty, an empty object is returned.
     * @returns {Config} The configuration object parsed from the config file.
     */
    static readConfig(): Config {
        if (this.cache !== null) {
            return this.cache;
        }

        if (!fs.existsSync(this.configPath)) {
            this.cache = {} as Config;
            return this.cache;
        }

        this.cache = JSON.parse(fs.readFileSync(this.configPath, "utf-8") || "{}");
        return this.cache || ({} as Config);
    }

    /**
     * Writes the configuration to the config file.
     * @param {Config} config - The configuration object to write.
     */
    static writeConfig(config: Config): void {
        fs.writeFileSync(this.configPath, JSON.stringify(config, null, 4));
        this.cache = config;
    }
}
