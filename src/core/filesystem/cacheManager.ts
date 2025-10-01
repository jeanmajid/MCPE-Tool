import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { CACHE_PATH } from "../constants/paths";

export class CacheManager {
    static validateCache(): void {
        if (!existsSync(CACHE_PATH)) {
            mkdirSync(CACHE_PATH, { recursive: true });
        }
    }

    static getPath(destPath: string): string {
        return path.join(CACHE_PATH, destPath);
    }

    static writeFile(destPath: string, data: string): void {
        this.validateCache();
        writeFileSync(this.getPath(destPath), data);
    }

    static readFile(destPath: string): string {
        this.validateCache();
        const path = this.getPath(destPath);
        if (!existsSync(path)) {
            return "";
        }
        return readFileSync(path).toString();
    }
}
