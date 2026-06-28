/* SPDX-License-Identifier: LGPL-3.0-or-later
 * ============================================================================
 *  MC Tool - Minecraft Bedrock addon development tool
 *  Copyright (C) 2025-2026 jeanmajid and contributors
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

import { rm } from "fs/promises";
import fs from "node:fs";
import path from "node:path";

import { ensureDirSync } from "../../../utils/files.js";
import { Transport } from "./transport.js";

export class LocalTransport implements Transport {
    private destPath: string;

    /**
     * @param destPath base local path (will be prefixed to all ops)
     */
    public constructor(destPath: string) {
        this.destPath = destPath.replace(/[\\/]$/, "");
    }

    public async ensureDir(dirRelative: string): Promise<void> {
        ensureDirSync(path.join(this.destPath, dirRelative));
    }

    public async writeFile(fileRelative: string, contents: string | Buffer): Promise<void> {
        const pathTo = path.join(this.destPath, fileRelative);
        ensureDirSync(path.dirname(pathTo));
        fs.writeFileSync(pathTo, contents);
    }

    public async copyFile(srcPath: string, fileRelative: string): Promise<void> {
        const pathTo = path.join(this.destPath, fileRelative);
        ensureDirSync(path.dirname(pathTo));
        fs.copyFileSync(srcPath, pathTo);
    }

    public async deleteFile(fileRelative: string): Promise<void> {
        const pathTo = path.join(this.destPath, fileRelative);
        if (fs.existsSync(pathTo)) {
            await rm(pathTo, { recursive: true });
        }
    }
}
