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

import { appendFileSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const licenseText = `/* SPDX-License-Identifier: LGPL-3.0-or-later
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
 */`

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mcToolSrcPath = join("../../../src");
const mcToolsExternal = join("../..");

recursiveReadFolder(mcToolSrcPath);
recursiveReadFolder(mcToolsExternal);

/**
 * @param {import("node:fs").PathLike} folderPath 
 * @returns {void}
 */
function recursiveReadFolder(folderPath) {
    for (const path of readdirSync(folderPath).map((p) => join(folderPath, p))) {
        recursiveRead(path);
    }
}

/**
 * @param {import("node:fs").PathLike} path 
 * @returns {void}
 */
function recursiveRead(path) {
    if (statSync(path).isDirectory()) {
        recursiveReadFolder(path);
    } else {
        processFile(path);
    }
}

processFile("../../app/src/main.cpp");

/**
 * @param {import("node:fs").PathLike} path 
 * @returns {void}
 */
function processFile(path) {
    if (!path.endsWith(".json") && !path.endsWith(".ts") && !path.endsWith(".js") && !path.endsWith(".")) {
        return;
    }

    let fileContents = readFileSync(path, { encoding: "utf-8" });

    fileContents = cleanOldLicenseText(fileContents);

    writeFileSync(path, licenseText);
    appendFileSync(path, "\n\n");
    appendFileSync(path, fileContents);
}

/**
 * @param {string} fileContents 
 * @returns {string}
 */
function cleanOldLicenseText(fileContents) {
    if (!fileContents.startsWith("/* SPDX-License-Identifier: LGPL-3.0-or-later")) {
        return fileContents;
    }

    const fileLineByLine = fileContents.split("\n");

    let i = 1;
    for (const line of fileLineByLine) {
        if (line.startsWith(" */")) {
            const start = fileLineByLine[i] === "" ? i + 1 : i;
            return fileLineByLine.splice(start, fileLineByLine.length).join("\n");
        }
        ++i;
    }
}