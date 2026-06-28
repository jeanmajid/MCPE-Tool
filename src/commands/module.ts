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

import { Command } from "../core/cli/command.js";
import { ConfigManager } from "../core/config/configManager.js";
import { Logger } from "../core/logger/logger.js";
import { ModuleManager } from "../core/modules/moduleManager.js";

Command.command("module").description("Manage modules");

Command.subCommand("add")
    .description("Add a module to the watcher")
    .action(async (args) => {
        const config = ConfigManager.readConfig();

        if (!config.name || !config.id) {
            Logger.error(
                'No config file found. Run "mc init" or if you already have a project run "mc repair".'
            );
            return;
        }

        if (args.length === 0) {
            Logger.error("No module name provided.");
            return;
        }

        await ModuleManager.loadAllModules();

        const exists = ModuleManager.checkIfModuleExists(args[0]);
        if (!exists) {
            Logger.error(`Module ${args[0]} does not exist.`);
            return;
        }
        config.modules = config.modules || [];
        if (config.modules.includes(args[0])) {
            Logger.error(`Module ${args[0]} is already in the list.`);
            return;
        }
        config.modules.push(args[0]);
        ConfigManager.writeConfig(config);
        Logger.info(`Added module ${args[0]}`);
    });

Command.subCommand("remove")
    .description("Remove a module from the watcher")
    .action(async (args) => {
        const config = ConfigManager.readConfig();

        if (!config.id) {
            Logger.error(
                'No config file found. Run "mc init" or if you already have a project run "mc repair".'
            );
            return;
        }
        if (args.length === 0) {
            Logger.error("No module name provided.");
            return;
        }

        config.modules = config.modules || [];
        if (!config.modules.includes(args[0])) {
            Logger.error(`Module ${args[0]} is not in the list.`);
            return;
        }
        config.modules = config.modules.filter((m) => m !== args[0]);
        ConfigManager.writeConfig(config);
        Logger.info(`Removed module ${args[0]}`);
    });

Command.subCommand("list")
    .description("List all modules")
    .action(async () => {
        await ModuleManager.loadAllModules();
        Logger.info("Modules:");
        for (const module of ModuleManager.modules) {
            Logger.info(`- ${module.name} - ${module.description}`);
        }
    });
