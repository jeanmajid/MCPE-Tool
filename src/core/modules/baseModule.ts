export abstract class BaseModule {
    public abstract name: string;
    public abstract description: string;
    public cancelFileTransfer?: boolean;

    public activator?(filePath: string): boolean;
    public handleFile?(filePath: string): FileHandlerResult;
    public onLaunch?(bpPath?: string, rpPath?: string): Promise<void> | void;
    public activatorHandlerPairs?: BaseActivatorHandlerPair[];
    public onExit?(): Promise<void> | void;
}

export interface FileHandlerResult {
    newFilePath: string | undefined;
    fileData: string | undefined;
}

export abstract class BaseActivatorHandlerPair {
    public activator?: (filePath: string) => boolean;
    public handleFile?: (filePath: string) => FileHandlerResult;
    public cancelFileTransfer?: boolean;
}
