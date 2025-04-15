const { program } = require("../main");
const { Watcher } = require("../models/files/watcher");
const { readConfig } = require("../utils/config");
const { COM_MOJANG_PATH } = require("../constants/paths");
const { ModuleManager } = require("../models/files/moduleManager");
const { ColorLogger } = require("../models/cli/colorLogger");

program
    .command("watch")
    .description("Watch the current directory and copy files to the destination")
    .action(async () => {
        const config = readConfig();
        
        if (!config.id) {
            ColorLogger.error('No config file found. Run "mc init" or if you already have a project run "mc repair".');
            return;
        }

        const bpPath = COM_MOJANG_PATH + "development_behavior_packs/" + config.name + "BP";
        const rpPath = COM_MOJANG_PATH + "development_resource_packs/" + config.name + "RP";

        if (!config.modules || config.modules.length === 0) {
            ModuleManager.modules = [];
        } else {
            await ModuleManager.filterModules(config.modules, bpPath, rpPath);
        }

        const watcher = new Watcher(".", bpPath, rpPath);
        watcher.startWatching();
    });
