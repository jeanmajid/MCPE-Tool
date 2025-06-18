export abstract class BaseModule {
    abstract name: string;
    abstract description: string;
    cancelFileTransfer?: boolean;

    activator?(filePath: string): boolean;
    handleFile?(filePath: string): FileHandlerResult;
    onLaunch?(bpPath?: string, rpPath?: string): Promise<void> | void;
    activatorHandlerPairs?: BaseActivatorHandlerPair[];
    onExit?(): Promise<void> | void;
}

export type FileHandlerResult = {
    newFilePath: string | undefined;
    fileData: string | undefined;
};

export abstract class BaseActivatorHandlerPair {
    activator?: (filePath: string) => boolean;
    handleFile?: (filePath: string) => FileHandlerResult;
    cancelFileTransfer?: boolean;
}
