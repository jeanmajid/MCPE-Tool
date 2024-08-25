export class Command {
    constructor() {
        this.commands = {};
    }

    command(name) {
        this.currentCommand = name;
        this.commands[name] = { description: "", action: null };
        return this;
    }

    description(desc) {
        if (this.currentCommand) {
            this.commands[this.currentCommand].description = desc;
        }
        return this;
    }

    action(actionFunc) {
        if (this.currentCommand) {
            this.commands[this.currentCommand].action = actionFunc;
        }
        return this;
    }

    async execute(commandName) {
        if (this.commands[commandName] && this.commands[commandName].action) {
            await this.commands[commandName].action();
        } else {
            console.log(`Command "${commandName}" not found.`);
        }
    }

    help() {
        console.log("Available commands:");
        for (const command in this.commands) {
            console.log(`- ${command}: ${this.commands[command].description}`);
        }
    }

    parse(argv) {
        const commandName = argv[2];
        if (!commandName || commandName === "help") {
            this.help();
        } else {
            this.execute(commandName);
        }
    }
}
