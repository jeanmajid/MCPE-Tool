const os = require("os");


const HOME_DIR = os.homedir();
const COM_MOJANG_PATH = `${HOME_DIR}/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/`;
const PROJECT_PATH = `${HOME_DIR}/OneDrive/Dokumente/GitHub/MCPE-Tool/`;
const PROJECT_PATH_SRC = `${PROJECT_PATH}src/`;

const IGNORE_PATHS = ["**/node_modules/**", "**/.git/**", "**/.vscode/**", "**/.gitignore", "**/package.json", "**/package-lock.json"];

module.exports = {
    COM_MOJANG_PATH,
    PROJECT_PATH,
    PROJECT_PATH_SRC,
    IGNORE_PATHS,
};
