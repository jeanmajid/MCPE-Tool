export type ActivatorHandlerPair = {
    activator: (filePath: string) => boolean;
    handleFile: (filePath: string) => { newFilePath: string | undefined; fileData: string | undefined };
    cancelFileTransfer: boolean;
};

export type Module = {
    name: string;
    description: string;
    cancelFileTransfer: boolean;
    activator: (filePath: string) => void;
    handleFile: (filePath: string) => { newFilePath: string | undefined; fileData: string | undefined };
    onLaunch: (bpPath: string, rpPath: string) => Promise<void>;
    activatorHandlerPairs: ActivatorHandlerPair[];
    onExit: () => void;
};