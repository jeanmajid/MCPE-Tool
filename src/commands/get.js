import { readConfig } from "../utils/config.js";
import fs from "fs";
import { ColorLogger } from "../models/cli/colorLogger.js";
import { Command } from "../models/cli/command.js";

// TODO: Implement fix

Command
    .command("get")
    .description("get specific things based on the input")
    .action(async () => {
        const config = readConfig();
        if (!config.id) {
            ColorLogger.error('No config file found. Run "mc init" or if you already have a project run "mc repair".');
            return;
        }
    });

Command
    .subCommand("animationNames")
    .description("fixes the animation names")
    .action(async (args, flags) => {
        const file = fs.readFileSync(args[0]);
        if (!file) {
            ColorLogger.error("File not found!");
            return;
        }

        const data = JSON.parse(file);
        if (!data.animations) {
            ColorLogger.error("No animations found in the file!");
            return;
        }

        for (const originalName of Object.keys(data.animations)) {
            ColorLogger.info(originalName);
        }

    });
