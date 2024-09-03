const { Color } = require("./color");
const { ColorLogger } = require("./colorLogger");

/**
 * Represents a command line interface command.
 */
class Command {
    /**
     * Constructs a new Command instance.
     */
    constructor() {
        this.commands = {};
        this.currentCommand = null;
        this.currentSubCommand = null;
    }

    /**
     * Sets the current command name.
     * @param {string} name - The name of the command.
     * @returns {Command} The Command instance.
     */
    command(name) {
        this.currentSubCommand = null;
        const command = { description: "", action: null };
        this.commands[name] = command;
        this.currentCommand = command;
        return this;
    }

    subCommand(name) {
        if (this.currentCommand) {
            this.currentSubCommand = name;
            const subCommand = { description: "", action: null };
            if (!this.currentCommand.subCommands) {
                this.currentCommand.subCommands = {};
            }
            this.currentCommand.subCommands[name] = subCommand;
        }
        return this;
    }

    /**
     * Sets the description for the current command.
     * @param {string} desc - The description of the command.
     * @returns {Command} The Command instance.
     */
    description(desc) {
        if (this.currentCommand) {
            if (this.currentSubCommand) {
                this.currentCommand.subCommands[this.currentSubCommand].description = desc;
            } else {
                this.currentCommand.description = desc;
            }
        }
        return this;
    }

    /**
     * Sets the action function for the current command.
     * @param {Function} actionFunc - The action function to be executed for the command.
     * @returns {Command} The Command instance.
     */
    action(actionFunc) {
        if (this.currentCommand) {
            if (this.currentSubCommand) {
                this.currentCommand.subCommands[this.currentSubCommand].action = actionFunc;
            } else {
                this.currentCommand.action = actionFunc;
            }
        }
        return this;
    }

    /**
     * Executes the specified command.
     * @param {string} commandName - The name of the command to execute.
     * @returns {Promise} - A promise that resolves when the command execution is complete.
     */
    async execute(commandName, subCommand = undefined, args, flags = []) {
        if (!this.commands[commandName]) {
            ColorLogger.error(`Command "${commandName}" not found.`);
            return;
        }

        if (subCommand && this.commands[commandName]?.subCommands) {
            const action = this.commands[commandName].subCommands[subCommand]?.action;
            if (!action) {
                ColorLogger.error(`Subcommand "${subCommand}" not found for command "${commandName}".`);
                return;
            }
            await action(args, flags);
        } else {
            const action = this.commands[commandName].action;
            if (!action) {
                ColorLogger.error(`Command "${commandName}" requires a subcommand.`);
                return;
            }
            await action(args, flags);
        }
    }

    /**
     * Displays the available commands and their descriptions.
     */
    help() {
        console.log(Color.blue("Available commands:"));
        for (const command in this.commands) {
            console.log(Color.green(`- ${command}: ${this.commands[command].description}`));
            if (this.commands[command].subCommands) {
                for (const subCommand in this.commands[command].subCommands) {
                    console.log(Color.yellow(`  - ${subCommand}: ${this.commands[command].subCommands[subCommand].description}`));
                }
            }
        }
    }
    /**
     * Parses the command line arguments and executes the corresponding command.
     * @param {string[]} argv - The command line arguments.
     */
    parse(argv) {
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
            this.help();
        } else {
            this.execute(commandName, subCommand, args, flags);
        }
    }
}

module.exports = {
    Command,
};
