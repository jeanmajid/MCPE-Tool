/**
 * Represents a command line interface command.
 * @class
 */
class Command {
    /**
     * Constructs a new Command instance.
     */
    constructor() {
        this.commands = {};
    }

    /**
     * Sets the current command name.
     * @param {string} name - The name of the command.
     * @returns {Command} The Command instance.
     */
    command(name) {
        this.currentCommand = name;
        this.commands[name] = { description: "", action: null };
        return this;
    }

    /**
     * Sets the description for the current command.
     * @param {string} desc - The description of the command.
     * @returns {Command} The Command instance.
     */
    description(desc) {
        if (this.currentCommand) {
            this.commands[this.currentCommand].description = desc;
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
            this.commands[this.currentCommand].action = actionFunc;
        }
        return this;
    }

    /**
     * Executes the specified command.
     * @param {string} commandName - The name of the command to execute.
     * @returns {Promise} A promise that resolves when the command execution is complete.
     */
    async execute(commandName) {
        if (this.commands[commandName] && this.commands[commandName].action) {
            await this.commands[commandName].action();
        } else {
            console.log(`Command "${commandName}" not found.`);
        }
    }

    /**
     * Displays the available commands and their descriptions.
     */
    help() {
        console.log("Available commands:");
        for (const command in this.commands) {
            console.log(`- ${command}: ${this.commands[command].description}`);
        }
    }

    /**
     * Parses the command line arguments and executes the corresponding command.
     * @param {string[]} argv - The command line arguments.
     */
    parse(argv) {
        const commandName = argv[2];
        if (!commandName || commandName === "help") {
            this.help();
        } else {
            this.execute(commandName);
        }
    }
}

module.exports = {
    Command
}
