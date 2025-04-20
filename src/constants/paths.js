import os from "os";
import { readConfig } from "../utils/config.js";
const config = readConfig();

export const HOME_DIR = os.homedir();
export const COM_MOJANG_PATH = `${HOME_DIR}/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/`;
export const PROJECT_PATH = `${HOME_DIR}/OneDrive/Dokumente/GitHub/MCPE-Tool/`;
export const PROJECT_PATH_SRC = `${PROJECT_PATH}src/`;
export const BEHAVIOUR_PACK_PATH = config.behaviourPackPath || "./BP"
export const RESOURCE_PACK_PATH = config.resourcePackPath || "./RP"

export const IGNORE_PATHS = ["**/node_modules/**", "**/.git/**", "**/.github/**", "**/.vscode/**", "**/.gitignore", "**/package.json", "**/package-lock.json"];
