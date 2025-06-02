import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

/**
 * Ensures that the directory exists. If the directory structure does not exist, it is created.
 * @param {string} dirPath - The path of the directory to ensure.
 */
export function ensureDirSync(dirPath) {
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
export function removeSync(targetPath) {
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

export async function loadDir(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }
    const jsFiles = fs.readdirSync(dir).filter((f) => f.endsWith(".js"));
    await Promise.all(
        jsFiles.map((fileName) => {
            const fullPath = path.join(dir, fileName);
            return import(pathToFileURL(fullPath).href);
        })
    );
}
