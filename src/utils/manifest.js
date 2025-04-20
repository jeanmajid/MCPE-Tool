import fs from "fs";
import { BEHAVIOUR_PACK_PATH, RESOURCE_PACK_PATH } from "../constants/paths.js";

/**
 * @typedef {Object} ManifestBP
 * @property {number} format_version - The format version.
 * @property {Object} header - The header information.
 * @property {string} header.name - The name of the project.
 * @property {string} header.description - The description of the project.
 * @property {string} header.uuid - The UUID of the project.
 * @property {number[]} header.version - The version of the project.
 * @property {number[]} header.min_engine_version - The minimum engine version required.
 * @property {Object[]} modules - The modules included in the project.
 * @property {string} modules.type - The type of the module.
 * @property {string} modules.uuid - The UUID of the module.
 * @property {number[]} modules.version - The version of the module.
 * @property {string} [modules.language] - The language of the module (if applicable).
 * @property {string} [modules.entry] - The entry point of the module (if applicable).
 * @property {Object} metadata - The metadata of the project.
 * @property {string[]} metadata.authors - The authors of the project.
 * @property {Object[]} dependencies - The dependencies of the project.
 * @property {string} dependencies.module_name - The name of the dependency module.
 * @property {string} dependencies.version - The version of the dependency module.
 */

/**
 * @typedef {Object} ManifestRP
 * @property {number} format_version - The format version.
 * @property {Object} header - The header information.
 * @property {string} header.name - The name of the project.
 * @property {string} header.description - The description of the project.
 * @property {string} header.uuid - The UUID of the project.
 * @property {number[]} header.version - The version of the project.
 * @property {number[]} header.min_engine_version - The minimum engine version required.
 * @property {Object[]} modules - The modules included in the project.
 * @property {string} modules.type - The type of the module.
 * @property {string} modules.uuid - The UUID of the module.
 * @property {number[]} modules.version - The version of the module.
 * @property {string} [modules.language] - The language of the module (if applicable).
 * @property {string} [modules.entry] - The entry point of the module (if applicable).
 * @property {Object} metadata - The metadata of the project.
 * @property {string[]} metadata.authors - The authors of the project.
 * @property {Object[]} [dependencies] - The dependencies of the project (if applicable).
 * @property {string} dependencies.module_name - The name of the dependency module.
 * @property {string} dependencies.version - The version of the dependency module.
 */

/**
 * Reads the manifest file for the given type.
 * @param {"BP" | "RP"} type - The type of manifest to read.
 * @returns {ManifestBP | ManifestRP | undefined} The parsed JSON object from the manifest file.
 */
export function readManifest(type) {
    try {
        return JSON.parse(fs.readFileSync(`${type === "BP" ? BEHAVIOUR_PACK_PATH : RESOURCE_PACK_PATH}/manifest.json`));
    } catch (error) {
        return undefined;
    }
}

/**
 * Writes the manifest file for the given type.
 * @param {"BP" | "RP"} type - The type of manifest to write.
 * @param {ManifestBP | ManifestRP} manifest - The manifest object to write.
 */
export function writeManifest(type, manifest) {
    fs.writeFileSync(`${type === "BP" ? BEHAVIOUR_PACK_PATH : RESOURCE_PACK_PATH}/manifest.json`, JSON.stringify(manifest, null, 4));
}
