import { Logger } from "./../logger/logger.js";
import { Color } from "./../logger/color.js";
import { loadDir } from "../../utils/files.js";
import path from "path";
import { PROJECT_PATH_SRC } from "../constants/paths.js";
import { pathToFileURL } from "url";
import { existsSync } from "fs";

interface CommandAction {
    (args: string[], flags: string[]): Promise<void | unknown> | void | unknown;
}

interface SubCommand {
    description: string;
    action: CommandAction | null;
}

interface CommandDefinition {
    description: string;
    action: CommandAction | null;
    subCommands?: Record<string, SubCommand>;
}

export class Command {
    static commands: Record<string, CommandDefinition> = {};
    static currentCommand: CommandDefinition | null = null;
    static currentSubCommand: string | null = null;

    /**
     * Sets the current command name.
     * @param name - The name of the command.
     * @returns The Command class.
     */
    static command(name: string): typeof Command {
        Command.currentSubCommand = null;
        const command: CommandDefinition = { description: "", action: null };
        Command.commands[name] = command;
        Command.currentCommand = command;
        return Command;
    }

    static subCommand(name: string): typeof Command {
        if (Command.currentCommand) {
            Command.currentSubCommand = name;
            const subCommand: SubCommand = { description: "", action: null };
            if (!Command.currentCommand.subCommands) {
                Command.currentCommand.subCommands = {};
            }
            Command.currentCommand.subCommands[name] = subCommand;
        }
        return Command;
    }

    /**
     * Sets the description for the current command.
     * @param desc - The description of the command.
     * @returns The Command class.
     */
    static description(desc: string): typeof Command {
        if (Command.currentCommand) {
            if (Command.currentSubCommand) {
                Command.currentCommand.subCommands![Command.currentSubCommand].description = desc;
            } else {
                Command.currentCommand.description = desc;
            }
        }
        return Command;
    }

    /**
     * Sets the action function for the current command.
     * @param actionFunc - The action function to be executed for the command.
     * @returns The Command class.
     */
    static action(actionFunc: CommandAction): typeof Command {
        if (Command.currentCommand) {
            if (Command.currentSubCommand) {
                Command.currentCommand.subCommands![Command.currentSubCommand].action = actionFunc;
            } else {
                Command.currentCommand.action = actionFunc;
            }
        }
        return Command;
    }

    /**
     * Executes the specified command.
     * @param commandName - The name of the command to execute.
     * @param subCommand - The subcommand to execute.
     * @param args - Command arguments.
     * @param flags - Command flags.
     * @returns A promise that resolves when the command execution is complete.
     */
    static async execute(
        commandName: string,
        subCommand: string | undefined = undefined,
        args: string[],
        flags: string[] = []
    ): Promise<undefined | unknown> {
        let commandFilePath = pathToFileURL(
            path.join(PROJECT_PATH_SRC, "commands", commandName + ".js")
        );

        if (!existsSync(commandFilePath)) {
            commandFilePath = pathToFileURL(
                path.join(PROJECT_PATH_SRC, "customCommands", commandName + ".js")
            );
            if (!existsSync(commandFilePath)) {
                Logger.error(`Command "${commandName}" not found.`);
                return;
            }
        }
        await import(commandFilePath.href);
        if (!Command.commands[commandName]) {
            Logger.error(`Command "${commandName}" not registered properly.`);
            return;
        }

        if (subCommand && Command.commands[commandName]?.subCommands) {
            const action = Command.commands[commandName].subCommands[subCommand]?.action;
            if (!action) {
                Logger.error(`Subcommand "${subCommand}" not found for command "${commandName}".`);
                return;
            }
            return await action(args, flags);
        } else {
            const action = Command.commands[commandName].action;
            if (!action) {
                Logger.error(`Command "${commandName}" requires a subcommand.`);
                return;
            }
            return await action(args, flags);
        }
    }

    static async loadAllCommands(): Promise<void> {
        await Promise.all([loadDir(path.join(PROJECT_PATH_SRC, "commands")), loadDir("./plugins")]);
    }

    /**
     * Displays the available commands and their descriptions.
     */
    static async help(): Promise<void> {
        await this.loadAllCommands();
        console.log(Color.blue("Available commands:"));
        for (const command in Command.commands) {
            console.log(Color.green(`- ${command}: ${Command.commands[command].description}`));
            if (Command.commands[command].subCommands) {
                for (const subCommand in Command.commands[command].subCommands) {
                    console.log(
                        Color.yellow(
                            `  - ${subCommand}: ${Command.commands[command].subCommands![subCommand].description}`
                        )
                    );
                }
            }
        }
    }

    /**
     * Parses the command line arguments and executes the corresponding command.
     * @param argv - The command line arguments.
     */
    static parse(argv: string[]): void {
        const flags: string[] = [];
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
