import { readConfig } from "../utils/config.js";
import fs from "fs";
import { ColorLogger } from "../models/cli/colorLogger.js";
import { Command } from "../models/cli/command.js";

//TODO: Implement make

Command.command("make")
    .description("Makes stuff from premade templates")
    .action(async () => {
        const config = readConfig();
        if (!config.id) {
            ColorLogger.error(
                'No config file found. Run "mc init" or if you already have a project run "mc repair".'
            );
            return;
        }

        const isRP = fs.existsSync("./RP");
        const isBP = fs.existsSync("./BP");

        if (!isRP && !isBP) {
            ColorLogger.error("No BP or RP folder found. Please create one of them.");
            return;
        }
    });
