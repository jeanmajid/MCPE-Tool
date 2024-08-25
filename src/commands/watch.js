const { program } = require("../main");
const { Watcher } = require("../models/files/watcher");
const { readConfig } = require("../utils/config");
const { COM_MOJANG_PATH } = require("../constants/paths");

program
    .command("watch")
    .description("Watch the current directory and copy files to the destination")
    .action(async () => {
        const config = readConfig();

        if (!config.name) {
            console.error("No config file found. Run 'mc init' first.");
            return;
        }

        const bpPath = COM_MOJANG_PATH + "development_behavior_packs/" + config.name + "BP";
        const rpPath = COM_MOJANG_PATH + "development_resource_packs/" + config.name + "RP";

        const watcher = new Watcher(".", bpPath, rpPath);
        watcher.startWatching();
    });
