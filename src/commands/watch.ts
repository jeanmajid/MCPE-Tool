import { Command } from "../core/cli/command.js";
import { Watcher } from "../core/filesystem/watcher.js";
import { ConfigManager } from "../core/config/configManager.js";
import { OUTPUT_BEHAVIOUR_PACK_PATH, OUTPUT_RESOURCE_PACK_PATH } from "../core/constants/paths.js";
import { ModuleManager } from "../core/modules/moduleManager.js";
import { Logger } from "../core/logger/logger.js";
import { Questioner } from "../core/cli/questioner.js";
import { Color } from "../core/logger/color.js";
import { existsSync } from "fs";

Command.command("watch")
    .description("Watch the current directory and copy files to the destination")
    .action(async () => {
        const config = ConfigManager.readConfig();

        if (!config.id) {
            Logger.error(
                'No config file found. Run "mc init" or if you already have a project run "mc repair".'
            );
            return;
        }

        const bpPath = OUTPUT_BEHAVIOUR_PACK_PATH;
        const rpPath = OUTPUT_RESOURCE_PACK_PATH;

        if (existsSync(bpPath)) {
            const res = await Questioner.promptConfirm(
                `A BP already exists at the output location, do you want to overwrite? (${bpPath})`,
                Color.red
            );
            if (!res) {
                return;
            }
        }

        if (existsSync(rpPath)) {
            const res = await Questioner.promptConfirm(
                `A RP already exists at the output location, do you want to overwrite? (${rpPath})`,
                Color.red
            );
            if (!res) {
                return;
            }
        }

        if (!config.modules || config.modules.length === 0) {
            ModuleManager.modules = [];
        } else {
            await ModuleManager.loadAllModules();
            await ModuleManager.filterModules(config.modules, bpPath, rpPath);
        }

        const watcher = new Watcher(".", bpPath, rpPath);
        watcher.startWatching();

        return watcher;
    });
