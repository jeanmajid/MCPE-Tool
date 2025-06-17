export { generateUniqueId, generateUUIDv4 } from "../../utils/id.js";
export { readManifest, writeManifest } from "../../utils/manifest.js";
export type { ManifestDependency } from "../../utils/manifest.js";

export { ConfigManager } from "../config/configManager.js";
export type { Config } from "../config/configManager.js";

export { Logger } from "../logger/logger.js";
export { Color } from "../logger/color.js";

export { ModuleManager } from "../modules/moduleManager.js";
export type { Module } from "../modules/moduleManager.js";

export { pathHasAnyExtension, pathHasExtension, pathIsInDirectory } from "../../utils/path.js";
export {
    getPackageVersions,
    getLatestPackageVersion,
    getInstalledPackageVersion
} from "../../utils/npm.js";
export type { validPackageNames } from "../../utils/npm.js";
export { ensureDirSync, removeSync, loadDir } from "../../utils/files.js";
export { Command } from "../cli/command.js";
export { Questioner } from "../cli/questioner.js";

export {
    BEHAVIOUR_PACK_PATH,
    RESOURCE_PACK_PATH,
    COM_MOJANG_PATH,
    PROJECT_PATH,
    PROJECT_PATH_SRC
} from "../constants/paths.js";
