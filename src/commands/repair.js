import { ColorLogger } from "../models/cli/colorLogger.js";
import { Command } from "../models/cli/command.js";
import { readConfig, writeConfig } from "../utils/config.js";
import { generateUniqueId } from "../utils/id.js";

Command.command("repair")
    .description("repair the config")
    .action(async () => {
        const changesMade = [];
        const config = readConfig();

        if (config.name === undefined || config.name === "") {
            config.name = "default";
            changesMade.push("Added name");
        }

        if (config.id === undefined) {
            config.id = generateUniqueId();
            changesMade.push("Added an unique id");
        }

        if (config.modules === undefined) {
            config.modules = [];
            changesMade.push("Added the config array");
        }

        if (config.description === undefined) {
            config.description = "";
            changesMade.push("Added an description");
        }

        writeConfig(config);
        if (changesMade.length > 0) {
            ColorLogger.success("Succesfully repaired the config!");
            ColorLogger.info("Changes made:");
            for (const change of changesMade) {
                ColorLogger.info("- " + change);
            }
        } else {
            ColorLogger.info("Config is already up to date and fixed");
        }
    });
