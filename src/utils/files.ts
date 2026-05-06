import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Ensures that the directory exists. If the directory structure does not exist, it is created.
 * @param {string} dirPath - The path of the directory to ensure.
 */
export function ensureDirSync(dirPath: string): void {
    if (fs.existsSync(dirPath)) {
        return;
    }

    ensureDirSync(path.dirname(dirPath));

    fs.mkdirSync(dirPath);
}

export async function loadDir(dir: string): Promise<void> {
    if (!fs.existsSync(dir)) {
        return;
    }
    const jsFiles = fs.readdirSync(dir).filter(f => f.endsWith(".js"));
    await Promise.all(
        jsFiles.map(fileName => {
            const fullPath = path.join(dir, fileName);
            return import(pathToFileURL(fullPath).href);
        })
    );
}
