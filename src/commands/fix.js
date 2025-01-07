const { program } = require("../main");
const { readConfig } = require("../utils/config");
const fs = require("fs");
const { ColorLogger } = require("../models/cli/colorLogger");

program
    .command("fix")
    .description("Fix specific things based on the input")
    .action(async () => {
        const config = readConfig();
        if (!config.id) {
            ColorLogger.error('No config file found. Run "mc init" or if you already have a project run "mc repair".');
            return;
        }
    });

program
    .subCommand("animationNames")
    .description("fixes the animation names")
    .action(async (args, flags) => {
        const file = fs.readFileSync(args[0]);
        if (!file) {
            ColorLogger.error("File not found!");
            return;
        }
        let name = args[0].split(/[\/\\]/).pop();

        const data = JSON.parse(file);
        if (!data.animations) {
            ColorLogger.error("No animations found in the file!");
            return;
        }

        for (const originalName of Object.keys(data.animations)) {
            const newName = `animation.${name.split(".")[0]}.${originalName}`;
            ColorLogger.info(`Renaming ${originalName} to ${newName}`);
            data.animations[newName] = data.animations[originalName];
            delete data.animations[originalName];
        }

        fs.writeFileSync(args[0], JSON.stringify(data, null, 4));
    });