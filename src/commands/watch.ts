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

import { existsSync } from "node:fs";

import { Command } from "../core/cli/command.js";
import { Questioner } from "../core/cli/questioner.js";
import { ConfigManager } from "../core/config/configManager.js";
import { OUTPUT_BEHAVIOUR_PACK_PATH, OUTPUT_RESOURCE_PACK_PATH } from "../core/constants/paths.js";
import { Watcher } from "../core/filesystem/watcher.js";
import { Color } from "../core/logger/color.js";
import { Logger } from "../core/logger/logger.js";
import { ModuleManager } from "../core/modules/moduleManager.js";

Command.command("watch")
    .description("Watch the current directory and copy files to the destination")
    .action(async () => {
        const config = ConfigManager.readConfig();

        if (!config.id) {
            Logger.error(
                'No config file found. Run "mc init" or if you already have a project run "mc repair".'
            );
            return;
        }

        const bpPath = OUTPUT_BEHAVIOUR_PACK_PATH;
        const rpPath = OUTPUT_RESOURCE_PACK_PATH;

        if (existsSync(bpPath)) {
            const res = await Questioner.promptConfirm(
                `A BP already exists at the output location, do you want to overwrite? (${bpPath})`,
                Color.red
            );
            if (!res) {
                return;
            }
        }

        if (existsSync(rpPath)) {
            const res = await Questioner.promptConfirm(
                `A RP already exists at the output location, do you want to overwrite? (${rpPath})`,
                Color.red
            );
            if (!res) {
                return;
            }
        }

        if (!config.modules || config.modules.length === 0) {
            ModuleManager.modules = [];
        } else {
            await ModuleManager.loadAllModules();
            await ModuleManager.filterModules(config.modules, bpPath, rpPath);
        }

        const watcher = new Watcher(".", bpPath, rpPath);
        watcher.startWatching();

        return watcher;
    });
