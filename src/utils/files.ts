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

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Ensures that the directory exists. If the directory structure does not exist, it is created.
 * @param {string} dirPath - The path of the directory to ensure.
 */
export function ensureDirSync(dirPath: string): void {
    if (fs.existsSync(dirPath)) {
        return;
    }

    ensureDirSync(path.dirname(dirPath));

    fs.mkdirSync(dirPath);
}

export async function loadDir(dir: string): Promise<void> {
    if (!fs.existsSync(dir)) {
        return;
    }
    const jsFiles = fs.readdirSync(dir).filter((f) => f.endsWith(".js"));
    await Promise.all(
        jsFiles.map((fileName) => {
            const fullPath = path.join(dir, fileName);
            return import(pathToFileURL(fullPath).href);
        })
    );
}
