import { readConfig, writeConfig } from "../utils/config.js";
import { ModuleManager } from "../models/files/moduleManager.js";
import { ColorLogger } from "../models/cli/colorLogger.js";
import { Command } from "../models/cli/command.js";

Command.command("module").description("Manage modules");

Command.subCommand("add")
    .description("Add a module to the watcher")
    .action(async (args) => {
        const config = readConfig();

        if (!config.name || !config.id) {
            ColorLogger.error(
                'No config file found. Run "mc init" or if you already have a project run "mc repair".'
            );
            return;
        }

        if (args.length === 0) {
            ColorLogger.error("No module name provided.");
            return;
        }

        const exists = ModuleManager.checkIfModuleExists(args[0]);
        if (!exists) {
            ColorLogger.error(`Module ${args[0]} does not exist.`);
            return;
        }
        config.modules = config.modules || [];
        if (config.modules.includes(args[0])) {
            ColorLogger.error(`Module ${args[0]} is already in the list.`);
            return;
        }
        config.modules.push(args[0]);
        writeConfig(config);
        ColorLogger.info(`Added module ${args[0]}`);
    });

Command.subCommand("remove")
    .description("Remove a module from the watcher")
    .action(async (args) => {
        const config = readConfig();

        if (!config.id) {
            ColorLogger.error(
                'No config file found. Run "mc init" or if you already have a project run "mc repair".'
            );
            return;
        }
        if (args.length === 0) {
            ColorLogger.error("No module name provided.");
            return;
        }

        config.modules = config.modules || [];
        if (!config.modules.includes(args[0])) {
            ColorLogger.error(`Module ${args[0]} is not in the list.`);
            return;
        }
        config.modules = config.modules.filter((m) => m !== args[0]);
        writeConfig(config);
        ColorLogger.info(`Removed module ${args[0]}`);
    });

Command.subCommand("list")
    .description("List all modules")
    .action(async () => {
        await ModuleManager.loadAllModules();
        ColorLogger.info("Modules:");
        for (const module of ModuleManager.modules) {
            ColorLogger.info(`- ${module.name} - ${module.description}`);
        }
    });
