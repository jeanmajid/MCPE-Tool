import { loadDir } from "../../utils/files.js";
import { Color } from "./color.js";
import { ColorLogger } from "./colorLogger.js";
import path from "path";
import { PROJECT_PATH_SRC } from "../../constants/paths.js";
import { pathToFileURL } from "url";
import { existsSync } from "fs";

/**
 * Represents a command line interface command.
 */
export class Command {
    static commands = {};
    static currentCommand = null;
    static currentSubCommand = null;

    /**
     * Sets the current command name.
     * @param {string} name - The name of the command.
     * @returns {Command} The Command instance.
     */
    static command(name) {
        Command.currentSubCommand = null;
        const command = { description: "", action: null };
        Command.commands[name] = command;
        Command.currentCommand = command;
        return Command;
    }

    static subCommand(name) {
        if (Command.currentCommand) {
            Command.currentSubCommand = name;
            const subCommand = { description: "", action: null };
            if (!Command.currentCommand.subCommands) {
                Command.currentCommand.subCommands = {};
            }
            Command.currentCommand.subCommands[name] = subCommand;
        }
        return Command;
    }

    /**
     * Sets the description for the current command.
     * @param {string} desc - The description of the command.
     * @returns {Command} The Command instance.
     */
    static description(desc) {
        if (Command.currentCommand) {
            if (Command.currentSubCommand) {
                Command.currentCommand.subCommands[Command.currentSubCommand].description = desc;
            } else {
                Command.currentCommand.description = desc;
            }
        }
        return Command;
    }

    /**
     * Sets the action function for the current command.
     * @param {Function} actionFunc - The action function to be executed for the command.
     * @returns {Command} The Command instance.
     */
    static action(actionFunc) {
        if (Command.currentCommand) {
            if (Command.currentSubCommand) {
                Command.currentCommand.subCommands[Command.currentSubCommand].action = actionFunc;
            } else {
                Command.currentCommand.action = actionFunc;
            }
        }
        return Command;
    }

    /**
     * Executes the specified command.
     * @param {string} commandName - The name of the command to execute.
     * @returns {Promise} - A promise that resolves when the command execution is complete.
     */
    static async execute(commandName, subCommand = undefined, args, flags = []) {
        const commandFilePath = pathToFileURL(
            path.join(PROJECT_PATH_SRC, "commands", commandName + ".js")
        );
        if (!existsSync(commandFilePath)) {
            ColorLogger.error(`Command "${commandName}" not found.`);
            return;
        }
        await import(commandFilePath);
        if (!Command.commands[commandName]) {
            ColorLogger.error(`Command "${commandName}" not registered properly.`);
            return;
        }

        if (subCommand && Command.commands[commandName]?.subCommands) {
            const action = Command.commands[commandName].subCommands[subCommand]?.action;
            if (!action) {
                ColorLogger.error(
                    `Subcommand "${subCommand}" not found for command "${commandName}".`
                );
                return;
            }
            await action(args, flags);
        } else {
            const action = Command.commands[commandName].action;
            if (!action) {
                ColorLogger.error(`Command "${commandName}" requires a subcommand.`);
                return;
            }
            await action(args, flags);
        }
    }

    static async loadAllCommands() {
        await Promise.all([loadDir(path.join(PROJECT_PATH_SRC, "commands")), loadDir("./plugins")]);
    }

    /**
     * Displays the available commands and their descriptions.
     */
    static async help() {
        await this.loadAllCommands();
        console.log(Color.blue("Available commands:"));
        for (const command in Command.commands) {
            console.log(Color.green(`- ${command}: ${Command.commands[command].description}`));
            if (Command.commands[command].subCommands) {
                for (const subCommand in Command.commands[command].subCommands) {
                    console.log(
                        Color.yellow(
                            `  - ${subCommand}: ${Command.commands[command].subCommands[subCommand].description}`
                        )
                    );
                }
            }
        }
    }
    /**
     * Parses the command line arguments and executes the corresponding command.
     * @param {string[]} argv - The command line arguments.
     */
    static parse(argv) {
        const flags = [];
        let args = argv.slice(2).filter((arg) => {
            if (arg.startsWith("-")) {
                flags.push(arg);
                return false;
            }
            return true;
        });

        const commandName = args[0];
        const subCommand = args[1];
        if (subCommand) {
            args = args.slice(2);
        } else {
            args = args.slice(1);
        }
        if (!commandName || commandName === "help") {
            Command.help();
        } else {
            Command.execute(commandName, subCommand, args, flags);
        }
    }
}
