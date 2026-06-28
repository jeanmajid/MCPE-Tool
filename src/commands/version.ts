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
