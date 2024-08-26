const { program } = require("../main");
const { Watcher } = require("../models/files/watcher");
const { readConfig } = require("../utils/config");
const { COM_MOJANG_PATH } = require("../constants/paths");
const { ModuleManager } = require("../models/files/moduleManager");

program
    .command("watch")
    .description("Watch the current directory and copy files to the destination")
    .action(async () => {
        const config = readConfig();

        if (!config.name) {
            console.error("No config file found. Run 'mc init' first.");
            return;
        }

        if (!config.modules || config.modules.length === 0) {
            ModuleManager.modules = [];
        } else {
            ModuleManager.modules = ModuleManager.modules.filter(module => config.modules.includes(module.name));
            for (const module of ModuleManager.modules) {
                if (module.onLaunch) {
                    await module.onLaunch();
                }
                if (!module.handleFile) {
                    ModuleManager.modules = ModuleManager.modules.filter(m => m.name !== module.name);
                } else if (module.handleFile && !module.activator) {
                    throw new Error(`Module '${module.name}' must have an activator function.`);
                }
                
            }
        }

        const bpPath = COM_MOJANG_PATH + "development_behavior_packs/" + config.name + "BP";
        const rpPath = COM_MOJANG_PATH + "development_resource_packs/" + config.name + "RP";

        const watcher = new Watcher(".", bpPath, rpPath);
        watcher.startWatching();
    });
