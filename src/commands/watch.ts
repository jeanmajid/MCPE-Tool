import { Command } from "./../core/cli/command";
import { Watcher } from "./../core/filesystem/watcher";
import { ConfigManager } from "../core/config/configManager.js";
import { COM_MOJANG_PATH } from "../core/constants/paths.js";
import { ModuleManager } from "../core/modules/moduleManager.js";
import { Logger } from "../core/logger/logger.js";

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
