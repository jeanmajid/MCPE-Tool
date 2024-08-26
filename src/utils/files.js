const fs = require("fs");
const path = require("path");

/**
 * Ensures that the directory exists. If the directory structure does not exist, it is created.
 * @param {string} dirPath - The path of the directory to ensure.
 */
function ensureDirSync(dirPath) {
    if (fs.existsSync(dirPath)) {
        return;
    }

    ensureDirSync(path.dirname(dirPath));

    fs.mkdirSync(dirPath);
}

/**
 * Recursively removes a file or directory.
 * @param {string} targetPath - The path of the file or directory to remove.
 */
function removeSync(targetPath) {
    if (fs.existsSync(targetPath)) {
        if (fs.lstatSync(targetPath).isDirectory()) {
            fs.readdirSync(targetPath).forEach((file) => {
                const curPath = path.join(targetPath, file);
                removeSync(curPath);
            });
            fs.rmdirSync(targetPath);
        } else {
            fs.unlinkSync(targetPath);
        }
    }
}

module.exports = { ensureDirSync, removeSync };
