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

import fs from "node:fs";

import { parse, stringify } from "comment-json";

import { BEHAVIOUR_PACK_PATH, RESOURCE_PACK_PATH } from "../core/constants/paths.js";
import { validPackageNames } from "../core/constants/validMcpePackages.js";

interface ManifestModule {
    type: string;
    uuid: string;
    version: number[];
    language?: string;
    entry?: string;
}

export interface ManifestDependency {
    version: string;
    module_name?: validPackageNames;
    uuid?: string;
}

interface ManifestHeader {
    name: string;
    description: string;
    uuid: string;
    version: number[];
    min_engine_version: number[];
}

interface ManifestMetadata {
    authors: string[];
}

interface ManifestBP {
    format_version: number;
    header: ManifestHeader;
    modules: ManifestModule[];
    metadata: ManifestMetadata;
    dependencies: ManifestDependency[];
}

interface ManifestRP {
    format_version: number;
    header: ManifestHeader;
    modules: ManifestModule[];
    metadata: ManifestMetadata;
    dependencies?: ManifestDependency[];
}

/**
 * Reads the manifest file for the given type.
 * @param type - The type of manifest to read.
 * @returns The parsed JSON object from the manifest file.
 */

export function readManifest(type: "RP"): ManifestRP | undefined;
export function readManifest(type: "BP"): ManifestBP | undefined;
export function readManifest(type: "BP" | "RP"): ManifestBP | ManifestRP | undefined {
    try {
        return parse(
            fs.readFileSync(
                `${type === "BP" ? BEHAVIOUR_PACK_PATH : RESOURCE_PACK_PATH}/manifest.json`,
                "utf8"
            )
        ) as unknown as ManifestBP | ManifestRP;
    } catch {
        return undefined;
    }
}

/**
 * Writes the manifest file for the given type.
 * @param type - The type of manifest to write.
 * @param manifest - The manifest object to write.
 */
export function writeManifest(type: "BP", manifest: ManifestBP): void;
export function writeManifest(type: "RP", manifest: ManifestRP): void;
export function writeManifest(type: "BP" | "RP", manifest: ManifestBP | ManifestRP): void {
    fs.writeFileSync(
        `${type === "BP" ? BEHAVIOUR_PACK_PATH : RESOURCE_PACK_PATH}/manifest.json`,
        stringify(manifest, null, 4)
    );
}
