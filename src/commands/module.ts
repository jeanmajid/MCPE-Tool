import { Command } from "../core/cli/command.js";
import { ConfigManager } from "../core/config/configManager.js";
import { Logger } from "../core/logger/logger.js";
import { ModuleManager } from "../core/modules/moduleManager.js";

Command.command("module").description("Manage modules");

Command.subCommand("add")
    .description("Add a module to the watcher")
    .action(async (args) => {
        const config = ConfigManager.readConfig();

        if (!config.name || !config.id) {
            Logger.error(
                'No config file found. Run "mc init" or if you already have a project run "mc repair".'
            );
            return;
        }

        if (args.length === 0) {
            Logger.error("No module name provided.");
            return;
        }

        await ModuleManager.loadAllModules();

        const exists = ModuleManager.checkIfModuleExists(args[0]);
        if (!exists) {
            Logger.error(`Module ${args[0]} does not exist.`);
            return;
        }
        config.modules = config.modules || [];
        if (config.modules.includes(args[0])) {
            Logger.error(`Module ${args[0]} is already in the list.`);
            return;
        }
        config.modules.push(args[0]);
        ConfigManager.writeConfig(config);
        Logger.info(`Added module ${args[0]}`);
    });

Command.subCommand("remove")
    .description("Remove a module from the watcher")
    .action(async (args) => {
        const config = ConfigManager.readConfig();

        if (!config.id) {
            Logger.error(
                'No config file found. Run "mc init" or if you already have a project run "mc repair".'
            );
            return;
        }
        if (args.length === 0) {
            Logger.error("No module name provided.");
            return;
        }

        config.modules = config.modules || [];
        if (!config.modules.includes(args[0])) {
            Logger.error(`Module ${args[0]} is not in the list.`);
            return;
        }
        config.modules = config.modules.filter((m) => m !== args[0]);
        ConfigManager.writeConfig(config);
        Logger.info(`Removed module ${args[0]}`);
    });

Command.subCommand("list")
    .description("List all modules")
    .action(async () => {
        await ModuleManager.loadAllModules();
        Logger.info("Modules:");
        for (const module of ModuleManager.modules) {
            Logger.info(`- ${module.name} - ${module.description}`);
        }
    });
