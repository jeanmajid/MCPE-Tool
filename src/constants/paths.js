const os = require("os");
const { readConfig } = require("../utils/config");
const config = readConfig();

const HOME_DIR = os.homedir();
const COM_MOJANG_PATH = `${HOME_DIR}/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/`;
const PROJECT_PATH = `${HOME_DIR}/OneDrive/Dokumente/GitHub/MCPE-Tool/`;
const PROJECT_PATH_SRC = `${PROJECT_PATH}src/`;
const BEHAVIOUR_PACK_PATH = config.behaviourPackPath || "./BP"
const RESOURCE_PACK_PATH = config.resourcePackPath || "./RP"

const IGNORE_PATHS = ["**/node_modules/**", "**/.git/**", "**/.github/**", "**/.vscode/**", "**/.gitignore", "**/package.json", "**/package-lock.json"];

module.exports = {
    COM_MOJANG_PATH,
    PROJECT_PATH,
    PROJECT_PATH_SRC,
    IGNORE_PATHS,
    BEHAVIOUR_PACK_PATH,
    RESOURCE_PACK_PATH
};
