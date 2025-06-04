import fs from "fs";
import { Command } from "../core/cli/command";
import { Logger } from "../core/logger/logger";
import { ConfigManager } from "../core/config/configManager";

// TODO: Implement fix

Command.command("get")
    .description("get specific things based on the input")
    .action(async () => {
        const config = ConfigManager.readConfig();
        if (!config.id) {
            Logger.error(
                'No config file found. Run "mc init" or if you already have a project run "mc repair".'
            );
            return;
        }
    });

Command.subCommand("animationNames")
    .description("Gets animation names from a JSON file")
    .action(async (args) => {
        const file = fs.readFileSync(args[0], "utf-8");
        if (!file) {
            Logger.error("File not found!");
            return;
        }

        const data = JSON.parse(file);
        if (!data.animations) {
            Logger.error("No animations found in the file!");
            return;
        }

        for (const originalName of Object.keys(data.animations)) {
            Logger.info(originalName);
        }
    });
