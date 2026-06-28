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

import { Command } from "../core/cli/command.js";
import { Questioner } from "../core/cli/questioner.js";
import { ConfigManager } from "../core/config/configManager.js";
import { MC_CONFIG_PATH } from "../core/constants/public.js";
import { ManifestGenerator } from "../core/generators/manifestGenerator.js";
import { Logger } from "../core/logger/logger.js";
import { generateUniqueId } from "../utils/id.js";

Command.command("init")
    .description("Initialize the project with interactive prompts")
    .action(async () => {
        if (ConfigManager.readConfig().id) {
            Logger.error(
                "Project already initialized. Please remove the config file to reinitialize the project."
            );
            return;
        }
        const answers = await Questioner.prompt([
            {
                type: "input",
                name: "projectName",
                message: "Project name:",
                default: (): string => process.cwd().split(/[/\\]/).pop() as string,
            },
            {
                type: "input",
                name: "projectDescription",
                message: "Project description:",
                default: (): string => "",
            },
            {
                type: "confirm",
                name: "behaviourPack",
                message: "Behaviour pack?",
                default: (): boolean => true,
            },
            {
                type: "confirm",
                name: "resourcePack",
                message: "Resource pack?",
                default: (): boolean => false,
            },
            { type: "input", name: "author", message: "Project Author", default: (): string => "" },
        ]);
        Logger.info(`Initializing project: ${answers.projectName}`);
        const generatorRP = new ManifestGenerator(
            answers.projectName as string,
            answers.projectDescription as string
        );
        const generatorBP = new ManifestGenerator(
            answers.projectName as string,
            answers.projectDescription as string
        );
        if (answers.behaviourPack) {
            Logger.info("Creating behaviour pack...");
            fs.mkdirSync("BP", { recursive: true });

            generatorBP.addModule("data");
            generatorBP.addModule("script", "javascript", "scripts/index.js");
            if (answers.author) {
                generatorBP.addAuthor(answers.author as string);
            }
            generatorBP.addDependency("@minecraft/server", "1.0.0-beta");
            generatorBP.addDependency("@minecraft/server-ui", "1.0.0-beta");

            if (answers.resourcePack) {
                generatorBP.addDependencyUUID(generatorRP.mainUUID, "1.0.0");
            }

            fs.writeFileSync("BP/manifest.json", generatorBP.generateString());

            Logger.info("Creating scripts folder...");
            fs.mkdirSync("BP/scripts", { recursive: true });
            fs.writeFileSync("BP/scripts/index.js", "");
        }
        if (answers.resourcePack) {
            Logger.info("Creating resource pack...");
            fs.mkdirSync("RP", { recursive: true });

            generatorRP.addModule("resources");
            if (answers.author) {
                generatorRP.addAuthor(answers.author as string);
            }

            if (answers.behaviourPack) {
                generatorRP.addDependencyUUID(generatorBP.mainUUID, "1.0.0");
            }

            fs.writeFileSync("RP/manifest.json", generatorRP.generateString());
        }

        Logger.info("Creating config file...");
        fs.writeFileSync(
            "./config.json",
            JSON.stringify(
                {
                    $schema: MC_CONFIG_PATH,
                    name: answers.projectName,
                    description: answers.projectDescription,
                    modules: ["npm"],
                    id: generateUniqueId(),
                },
                null,
                4
            )
        );

        Logger.success("Project initialized!");
    });
