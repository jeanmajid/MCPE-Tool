import { existsSync } from "fs";
import { rm } from "fs/promises";
import path from "path";

import { Command } from "../core/cli/command.js";
import { ConfigManager } from "../core/config/configManager.js";
import { BEHAVIOUR_PACK_PATH } from "../core/constants/paths.js";
import { MC_CONFIG_PATH } from "../core/constants/public.js";
import { Logger } from "../core/logger/logger.js";
import { generateUniqueId } from "../utils/id.js";

Command.command("repair")
    .description(
        "repair the config and some other things, that may still be present from older version"
    )
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

        if (
            typeof (config as { behaviourPackPath?: string })["behaviourPackPath"] === "string" &&
            !config.behaviorPackPath
        ) {
            delete (config as { behaviourPackPath?: string })["behaviourPackPath"];
            config.behaviorPackPath = (config as { behaviourPackPath?: string }).behaviourPackPath;
            changesMade.push("Migrated behaviourPackPath option to behaviorPackPath");
        }

        if (config["$schema"] !== MC_CONFIG_PATH) {
            config["$schema"] = MC_CONFIG_PATH;
            changesMade.push("Updated schema path");
        }

        const removePaths = [
            path.join(BEHAVIOUR_PACK_PATH, "node_modules"),
            path.join(BEHAVIOUR_PACK_PATH, "package-lock.json"),
            path.join(BEHAVIOUR_PACK_PATH, "package.json"),
        ];

        for (const removePath of removePaths) {
            if (existsSync(removePath)) {
                await rm(removePath, { recursive: true });
                changesMade.push(`Deleted ${removePath}`);
            }
        }

        ConfigManager.writeConfig(config);
        if (changesMade.length > 0) {
            Logger.success("Successfully repaired the config!");
            Logger.info("Changes made:");
            for (const change of changesMade) {
                Logger.info("- " + change);
            }
        } else {
            Logger.info("Config is already up to date and fixed");
        }
    });
