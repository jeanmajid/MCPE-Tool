export abstract class Transport {
    public abstract ensureDir(dir: string): Promise<void>;
    public abstract writeFile(destPath: string, contents: string): Promise<void>;
    public abstract copyFile(srcPath: string, destPath: string): Promise<void>;
    public abstract deleteFile(destPath: string): Promise<void>;
}
