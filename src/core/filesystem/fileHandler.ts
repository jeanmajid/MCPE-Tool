/* SPDX-License-Identifier: LGPL-3.0-or-later
 * ============================================================================
 *  MC Tool - Minecraft Bedrock addon development tool
 *  Copyright (C) 2024-2026 jeanmajid and contributors
 *  https://github.com/jeanmajid/MCPE-Tool
 * ============================================================================
 *
 * This file is part of MC Tool.
 *
 * MC Tool is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MC Tool is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with MC Tool. If not, see <https://www.gnu.org/licenses/>.
 */

import path from "node:path";

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
