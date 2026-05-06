import path from "path";

import { BEHAVIOUR_PACK_PATH, RESOURCE_PACK_PATH } from "../constants/paths.js";
import { Logger } from "../logger/logger.js";
import { Transport } from "./transport/transport.js";

/**
 * Represents a file handler that performs file operations such as copying, deleting, and refreshing directories.
 */
export class FileHandler {
    private sourceDir: string;
    private transportBP: Transport;
    private transportRP: Transport;

    public constructor(sourceDir: string, transportBP: Transport, transportRP: Transport) {
        this.sourceDir = sourceDir;
        this.transportBP = transportBP;
        this.transportRP = transportRP;
    }

    private isBehaviorPack(filePath: string): boolean {
        return filePath.includes(
            BEHAVIOUR_PACK_PATH.replace("./", "").replaceAll("/", "\\") + "\\"
        );
    }

    private getTransportAndPath(filePath: string): { transport: Transport; pathTo: string } {
        const isBP = this.isBehaviorPack(filePath);
        const relativePath = path.relative(this.sourceDir, filePath);
        const transport = isBP ? this.transportBP : this.transportRP;
        const pathTo = relativePath.slice(
            isBP
                ? BEHAVIOUR_PACK_PATH.replace("./", "").length
                : RESOURCE_PACK_PATH.replace("./", "").length
        );
        return { transport, pathTo };
    }

    private async handleOperation<T>(
        operation: () => Promise<T>,
        successMessage: string,
        errorMessage: string
    ): Promise<void> {
        try {
            await operation();
            Logger.success(successMessage);
        } catch (err) {
            Logger.error(`${errorMessage} | ${err}`);
        }
    }

    public async copyFile(filePath: string): Promise<void> {
        const { transport, pathTo } = this.getTransportAndPath(filePath);

        await this.handleOperation(
            () => transport.copyFile(filePath, pathTo),
            `Copied: ${filePath} ➔ ${pathTo}`,
            `Copy failed: ${filePath} ➔ ${pathTo}`
        );
    }

    public async writeFile(filePath: string, newFile: string): Promise<void> {
        const { transport, pathTo } = this.getTransportAndPath(filePath);

        await this.handleOperation(
            () => transport.writeFile(pathTo, newFile),
            `Updated: ${pathTo}`,
            `Update failed: ${pathTo}`
        );
    }

    public async deleteFile(filePath: string): Promise<void> {
        const { transport, pathTo } = this.getTransportAndPath(filePath);

        await this.handleOperation(
            () => transport.deleteFile(pathTo),
            `Removed: ${pathTo}`,
            `Remove failed: ${pathTo}`
        );
    }

    public async removeDestinationDirectories(): Promise<void> {
        await Promise.all([this.transportBP.deleteFile("."), this.transportRP.deleteFile(".")]);
    }
}
