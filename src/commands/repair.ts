import { generateUniqueId } from "../utils/id.js";
import { Logger } from "../core/logger/logger.js";
import { Command } from "../core/cli/command.js";
import { ConfigManager } from "../core/config/configManager.js";

Command.command("repair")
    .description("repair the config")
    .action(async () => {
        const changesMade: string[] = [];
        const config = ConfigManager.readConfig();

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

        ConfigManager.writeConfig(config);
        if (changesMade.length > 0) {
            Logger.success("Succesfully repaired the config!");
            Logger.info("Changes made:");
            for (const change of changesMade) {
                Logger.info("- " + change);
            }
        } else {
            Logger.info("Config is already up to date and fixed");
        }
    });
