import { Watcher } from "../models/files/watcher.js";
import { readConfig } from "../utils/config.js";
import { COM_MOJANG_PATH } from "../constants/paths.js";
import { ModuleManager } from "../models/files/moduleManager.js";
import { ColorLogger } from "../models/cli/colorLogger.js";
import { Command } from "../models/cli/command.js";

Command.command("watch")
    .description("Watch the current directory and copy files to the destination")
    .action(async () => {
        const config = readConfig();

        if (!config.id) {
            ColorLogger.error(
                'No config file found. Run "mc init" or if you already have a project run "mc repair".'
            );
            return;
        }

        const bpPath = COM_MOJANG_PATH + "development_behavior_packs/" + config.name + "BP";
        const rpPath = COM_MOJANG_PATH + "development_resource_packs/" + config.name + "RP";

        if (!config.modules || config.modules.length === 0) {
            ModuleManager.modules = [];
        } else {
            await ModuleManager.loadAllModules();
            await ModuleManager.filterModules(config.modules, bpPath, rpPath);
        }

        const watcher = new Watcher(".", bpPath, rpPath);
        watcher.startWatching();
    });
