const { program } = require("../main");
const { Questioner } = require("../models/cli/questioner");
const { ManifestGenerator } = require("../models/generators/manifestGenerator");
const { ColorLogger } = require("../models/cli/colorLogger");
const fs = require("node:fs");
const { generateUniqueId } = require("../utils/id");
const { readConfig } = require("../utils/config");

program
    .command("init")
    .description("Initialize the project with interactive prompts")
    .action(async () => {
        if (readConfig().id) {
            ColorLogger.error("Project already initialized. Please remove the config file to reinitialize the project.");
            return;
        }
        const answers = await Questioner.prompt([
            {
                type: "input",
                name: "projectName",
                message: "Project name:",
                default: () => process.cwd().split(/[\/\\]/).pop(),
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
            }
        ]);
        ColorLogger.info(`Initializing project: ${answers.projectName}`);
        const generatorBP = new ManifestGenerator(answers.projectName, answers.projectDescription);
        const generatorRP = new ManifestGenerator(answers.projectName, answers.projectDescription);
        if (answers.behaviourPack) {
            ColorLogger.info("Creating behaviour pack...");
            fs.mkdirSync("BP", { recursive: true });

            generatorBP.addModule("data");
            generatorBP.addModule("script", "javascript", "scripts/index.js");
            generatorBP.addAuthor("jeanmajid");
            generatorBP.addDependency("@minecraft/server", "1.0.0-beta");
            generatorBP.addDependency("@minecraft/server-ui", "1.0.0-beta");

            if (answers.resourcePack) generatorBP.addDependencyUUID(generatorRP.mainUUID, "1.0.0");

            fs.writeFileSync("BP/manifest.json", generatorBP.generateString());

            ColorLogger.info("Creating scripts folder...");
            fs.mkdirSync("BP/scripts", { recursive: true });
            fs.writeFileSync("BP/scripts/index.js", "");
        }
        if (answers.resourcePack) {
            ColorLogger.info("Creating resource pack...");
            fs.mkdirSync("RP", { recursive: true });

            generatorRP.addModule("resources");
            generatorRP.addAuthor("jeanmajid");

            if (answers.behaviourPack) generatorRP.addDependencyUUID(generatorBP.mainUUID, "1.0.0");

            fs.writeFileSync("RP/manifest.json", generatorRP.generateString());
        }

        ColorLogger.info("Creating config file...");
        fs.writeFileSync(
            "./config.json",
            JSON.stringify(
                {
                    name: answers.projectName,
                    description: answers.projectDescription,
                    modules: [
                        "npm"
                    ],
                    id: generateUniqueId()
                },
                null,
                4
            )
        );

        ColorLogger.success("Project initialized!");
    });
