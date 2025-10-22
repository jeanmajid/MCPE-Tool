import fs from "fs";
import { validPackageNames } from "./../core/constants/validMcpePackages.js";
import { BEHAVIOUR_PACK_PATH, RESOURCE_PACK_PATH } from "../core/constants/paths.js";

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
        return JSON.parse(
            fs.readFileSync(
                `${type === "BP" ? BEHAVIOUR_PACK_PATH : RESOURCE_PACK_PATH}/manifest.json`,
                "utf8"
            )
        );
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
        JSON.stringify(manifest, null, 4)
    );
}
