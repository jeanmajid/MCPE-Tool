export abstract class BaseModule {
    abstract name: string;
    abstract description: string;
    cancelFileTransfer?: boolean;

    activator?(filePath: string): boolean;
    handleFile?(filePath: string): {
        newFilePath: string | undefined;
        fileData: string | undefined;
    };
    onLaunch?(bpPath?: string, rpPath?: string): Promise<void> | void;
    activatorHandlerPairs?: BaseActivatorHandlerPair[];
    onExit?(): Promise<void> | void;
}

export abstract class BaseActivatorHandlerPair {
    activator: (filePath: string) => boolean;
    handleFile: (filePath: string) => {
        newFilePath: string | undefined;
        fileData: string | undefined;
    };
    cancelFileTransfer: boolean;

    constructor(
        activator: (filePath: string) => boolean,
        handleFile: (filePath: string) => {
            newFilePath: string | undefined;
            fileData: string | undefined;
        },
        cancelFileTransfer: boolean
    ) {
        this.activator = activator;
        this.handleFile = handleFile;
        this.cancelFileTransfer = cancelFileTransfer;
    }
}
