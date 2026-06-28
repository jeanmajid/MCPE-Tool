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
import { PROJECT_VERSION } from "../core/constants/version.js";

Command.command("version")
    .description("Displays the current version of the tool")
    .action(async () => {
        console.log(`                                         
██▄  ▄██ ▄█████   ██████ ▄████▄ ▄████▄ ██     
██ ▀▀ ██ ██         ██   ██  ██ ██  ██ ██     
██    ██ ▀█████     ██   ▀████▀ ▀████▀ ██████ 

Minecraft Bedrock Addon Development Tool

Version: ${PROJECT_VERSION}
Author : jeanmajid
`);
    });
