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

import path from "node:path";
import os from "os";
import { fileURLToPath } from "url";

import { ConfigManager } from "../config/configManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PROJECT_PATH = path.join(__dirname, "../../..");

const config = ConfigManager.readConfig();
export const HOME_DIR = os.homedir();

export const COM_MOJANG_PATH = ((): string => {
    switch (config.output) {
        case "stable":
            return path.join(
                HOME_DIR,
                "AppData/Roaming/Minecraft Bedrock/Users/Shared/games/com.mojang"
            );
        case "preview":
            return path.join(
                HOME_DIR,
                "AppData/Roaming/Minecraft Bedrock Preview/Users/Shared/games/com.mojang"
            );
        case "stable_uwp":
            return path.join(
                HOME_DIR,
                "AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang"
            );
        case "preview_uwp":
            return path.join(
                HOME_DIR,
                "AppData/Local/Packages/Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe/LocalState/games/com.mojang"
            );
        default:
            return path.join(
                HOME_DIR,
                "AppData/Roaming/Minecraft Bedrock/Users/Shared/games/com.mojang"
            );
    }
})();

export const OUTPUT_BEHAVIOUR_PACK_PATH = path.join(
    COM_MOJANG_PATH,
    "development_behavior_packs",
    config.name + "BP"
);

export const OUTPUT_RESOURCE_PACK_PATH = path.join(
    COM_MOJANG_PATH,
    "development_resource_packs",
    config.name + "RP"
);

export const PROJECT_PATH_SRC = path.join(PROJECT_PATH, "dist");
export const BEHAVIOUR_PACK_PATH = config.behaviorPackPath || path.join(".", "BP");
export const RESOURCE_PACK_PATH = config.resourcePackPath || path.join(".", "RP");

export const IGNORE_PATHS = [
    "**/node_modules/**",
    "**/.git/**",
    "**/.github/**",
    "**/.vscode/**",
    "**/.gitignore",
    "**/package.json",
    "**/pnpm-lock.yaml",
    "**/package-lock.json",
];

export const EXTERNAL_PATHS = {
    TRANSLATE_PYTHON: path.join(PROJECT_PATH, "external/translate/translateProject.py"),
};
