import { ConfigManager } from "../config/configManager.js";
import { fileURLToPath } from "url";
import path from "path";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PROJECT_PATH = path.join(__dirname, "../../..");

const config = ConfigManager.readConfig();
export const HOME_DIR = os.homedir();

export const COM_MOJANG_PATH = ((): string => {
    switch (config.output) {
        case "stable":
            return path.join(
                HOME_DIR,
                "AppData/Roaming/Minecraft Bedrock/Users/Shared/games/com.mojang"
            );
        case "preview":
            return path.join(
                HOME_DIR,
                "AppData/Roaming/Minecraft Bedrock Preview/Users/Shared/games/com.mojang"
            );
        case "stable_uwp":
            return path.join(
                HOME_DIR,
                "AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang"
            );
        case "preview_uwp":
            return path.join(
                HOME_DIR,
                "AppData/Local/Packages/Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe/LocalState/games/com.mojang"
            );
        default:
            return path.join(
                HOME_DIR,
                "AppData/Roaming/Minecraft Bedrock/Users/Shared/games/com.mojang"
            );
    }
})();

export const OUTPUT_BEHAVIOUR_PACK_PATH = path.join(
    COM_MOJANG_PATH,
    "development_behavior_packs",
    config.name + "BP"
);

export const OUTPUT_RESOURCE_PACK_PATH = path.join(
    COM_MOJANG_PATH,
    "development_resource_packs",
    config.name + "RP"
);

export const PROJECT_PATH_SRC = path.join(PROJECT_PATH, "dist");
export const BEHAVIOUR_PACK_PATH = config.behaviourPackPath || path.join(".", "BP");
export const RESOURCE_PACK_PATH = config.resourcePackPath || path.join(".", "RP");

export const IGNORE_PATHS = [
    "**/node_modules/**",
    "**/.git/**",
    "**/.github/**",
    "**/.vscode/**",
    "**/.gitignore",
    "**/package.json",
    "**/package-lock.json"
];

export const EXTERNAL_PATHS = {
    TRANSLATE_PYTHON: path.join(PROJECT_PATH, "external/translate/translateProject.py")
};
