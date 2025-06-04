import fs from "fs";
import { Command } from "../core/cli/command.js";
import { ConfigManager } from "../core/config/configManager.js";
import { Logger } from "../core/logger/logger.js";

//TODO: Implement make

Command.command("make")
    .description("Makes stuff from premade templates")
    .action(async () => {
        const config = ConfigManager.readConfig();
        if (!config.id) {
            Logger.error(
                'No config file found. Run "mc init" or if you already have a project run "mc repair".'
            );
            return;
        }

        const isRP = fs.existsSync("./RP");
        const isBP = fs.existsSync("./BP");

        if (!isRP && !isBP) {
            Logger.error("No BP or RP folder found. Please create one of them.");
            return;
        }
    });
