export abstract class Transport {
    abstract ensureDir(dir: string): Promise<void>;
    abstract writeFile(destPath: string, contents: string): Promise<void>;
    abstract copyFile(srcPath: string, destPath: string): Promise<void>;
    abstract deleteFile(destPath: string): Promise<void>;
}
