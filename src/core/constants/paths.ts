import { ConfigManager } from "./../config/configManager.js";
import os from "os";

const config = ConfigManager.readConfig();
export const HOME_DIR = os.homedir();
export const COM_MOJANG_PATH =
    config.outPut !== "preview"
        ? `${HOME_DIR}/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/`
        : `${HOME_DIR}/AppData/Local/Packages/Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe/LocalState/games/com.mojang/`;
export const PROJECT_PATH = `${HOME_DIR}/Documents/GitHub/MCPE-Tool/`;
export const PROJECT_PATH_SRC = `${PROJECT_PATH}dist/`;
export const BEHAVIOUR_PACK_PATH = config.behaviourPackPath || "./BP";
export const RESOURCE_PACK_PATH = config.resourcePackPath || "./RP";

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
    TRANSLATE_PYTHON: `${PROJECT_PATH}external/translate/translateProject.py`
};
