#!/usr/bin/env node
const { program } = require("commander");
const { Watcher } = require("./models/watcher");
const { readConfig } = require("./utils/config");
const { Questioner } = require("./models/questioner");
const { ManifestGenerator } = require("./models/manifestGenerator");
const { ColorLogger } = require("./models/colorLogger");
const fs = require("fs-extra");

const COM_MOJANG_PATH = "C:/Users/jeanh/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/";

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

program
    .command("init")
    .description("Initialize the project with interactive prompts")
    .action(async () => {
        const answers = await Questioner.prompt([
            {
                type: "input",
                name: "projectName",
                message: "Project name:",
                default: () => "MyProject",
            },
            {
                type: "input",
                name: "projectDescription",
                message: "Project description:",
                default: () => "",
            },
            {
                type: "confirm",
                name: "behaviourPack",
                message: "Behaviour pack?",
                default: () => true,
            },
            {
                type: "confirm",
                name: "resourcePack",
                message: "Resource pack?",
                default: () => false,
            },
            {
                type: "confirm",
                name: "typescript",
                message: "Use TypeScript?",
                default: () => false,
            },
        ]);
        ColorLogger.info(`Initializing project: ${answers.projectName}`);
        console.log(answers);
        if (answers.behaviourPack) {
            ColorLogger.info("Creating behaviour pack...");
            fs.mkdirSync("BP", { recursive: true });

            const generatorBP = new ManifestGenerator(answers.projectName, answers.projectDescription);
            generatorBP.addModule("data");
            generatorBP.addModule("script", "javascript", "scripts/index.js");
            generatorBP.addAuthor("jeanmajid");
            generatorBP.addDependency("@minecraft/server", "1.12.0-beta");
            generatorBP.addDependency("@minecraft/server-ui", "1.2.0-beta");

            fs.writeFileSync("BP/manifest.json", generatorBP.generateString());

            ColorLogger.info("Creating scripts folder...");

            fs.mkdirSync("BP/scripts", { recursive: true });
            fs.writeFileSync("BP/scripts/index.js", "");
        }
        if (answers.resourcePack) {
            ColorLogger.info("Creating resource pack...");
            fs.mkdirSync("RP", { recursive: true });

            const generatorRP = new ManifestGenerator(answers.projectName, answers.projectDescription);
            generatorRP.addModule("resources");
            generatorRP.addAuthor("jeanmajid");

            fs.writeFileSync("RP/manifest.json", generatorRP.generateString());
        }

        ColorLogger.info("Creating config file...");
        fs.writeFileSync(
            "config.json",
            JSON.stringify(
                {
                    name: answers.projectName,
                    description: answers.projectDescription,
                },
                null,
                4
            )
        );

        ColorLogger.success("Project initialized!");
    });

program.parse(process.argv);

function Cleanup(callback) {
    callback = callback || noOp;
    process.on("cleanup", callback);

    process.on("exit", function () {
        process.emit("cleanup");
    });

    process.on("SIGINT", function () {
        console.log("Ctrl-C...");
        process.emit("cleanup");
        process.exit(2);
    });

    process.on("uncaughtException", function (e) {
        console.log("Uncaught Exception...");
        process.emit("cleanup");
        console.log(e.stack);
        process.exit(99);
    });
}


