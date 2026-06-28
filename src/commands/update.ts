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

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { Command } from "../core/cli/command.js";
import { PROJECT_PATH } from "../core/constants/paths.js";
import { Logger } from "../core/logger/logger.js";

Command.command("update")
    .description("Updates the tool to the newest version")
    .action(async () => {
        // We are just checking if the src folder exists, bcs people that install it from npm don't have it
        const isInstalledFromSource = existsSync(join(PROJECT_PATH, "/src"));

        if (isInstalledFromSource) {
            try {
                Logger.info("Updating from git repository...");

                process.chdir(PROJECT_PATH);
                execSync("git pull origin main", { stdio: "inherit" });
                execSync("install.bat -y", { stdio: "inherit" });

                Logger.success("Update completed!");
            } catch (error) {
                if (error instanceof Error) {
                    Logger.error("Failed to update:" + error.message);
                }
                Logger.info("Try running 'git pull' manually in the project directory");
            }
        } else {
            Logger.info("Updating from npm...");
            execSync("npm update -g @jeanmajid/mcpe-tool", { stdio: "inherit" });
        }
    });
