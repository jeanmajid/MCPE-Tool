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

import { spawn } from "node:child_process";
import fs from "node:fs";

import { Command } from "../core/cli/command.js";
import { EXTERNAL_PATHS } from "../core/constants/paths.js";
import { Logger } from "../core/logger/logger.js";

Command.command("translate")
    .description("translates into all available languages")
    .action(async () => {
        const mainLangFilePath = "./RP/texts/en_US.lang";
        if (!fs.existsSync(mainLangFilePath)) {
            Logger.error(`Make sure to create and lang file at ${mainLangFilePath} with some keys`);
            return;
        }
        Logger.info("Starting to translate all lang keys...");
        const script = spawn("python", ["-u", EXTERNAL_PATHS.TRANSLATE_PYTHON], {
            cwd: ".",
            env: { ...process.env, PYTHONIOENCODING: "utf-8" },
        });
        script.stdout.on("data", (data) => {
            Logger.info(data.toString());
        });
        script.stderr.on("data", (data) => {
            if (data.toString().includes("FutureWarning")) {
                return;
            }
            Logger.error(data.toString());
        });
        script.on("close", (code) => {
            Logger.info(`Translation script exited with code ${code}`);
        });
    });
