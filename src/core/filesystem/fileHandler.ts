import { Logger } from "../logger/logger.js";
import path from "path";
import { Transport } from "./transport/transport.js";
import { BEHAVIOUR_PACK_PATH, RESOURCE_PACK_PATH } from "../constants/paths.js";

/**
 * Represents a file handler that performs file operations such as copying, deleting, and refreshing directories.
 */
export class FileHandler {
    private sourceDir: string;
    private transportBP: Transport;
    private transportRP: Transport;

    constructor(sourceDir: string, transportBP: Transport, transportRP: Transport) {
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
            isBP ? BEHAVIOUR_PACK_PATH.length - 2 : RESOURCE_PACK_PATH.length - 2
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

    async copyFile(filePath: string): Promise<void> {
        const { transport, pathTo } = this.getTransportAndPath(filePath);

        await this.handleOperation(
            () => transport.copyFile(filePath, pathTo),
            `Copied: ${filePath} ➔ ${pathTo}`,
            `Copy failed: ${filePath} ➔ ${pathTo}`
        );
    }

    async writeFile(filePath: string, newFile: string): Promise<void> {
        const { transport, pathTo } = this.getTransportAndPath(filePath);

        await this.handleOperation(
            () => transport.writeFile(pathTo, newFile),
            `Updated: ${pathTo}`,
            `Update failed: ${pathTo}`
        );
    }

    async deleteFile(filePath: string): Promise<void> {
        const { transport, pathTo } = this.getTransportAndPath(filePath);

        await this.handleOperation(
            () => transport.deleteFile(pathTo),
            `Removed: ${pathTo}`,
            `Remove failed: ${pathTo}`
        );
    }

    async removeDestinationDirectories(): Promise<void> {
        await Promise.all([this.transportBP.deleteFile("."), this.transportRP.deleteFile(".")]);
    }
}
