const { program } = require("../main");
const { Questioner } = require("../models/cli/questioner");
const { ManifestGenerator } = require("../models/generators/manifestGenerator");
const { ColorLogger } = require("../models/cli/colorLogger");
const fs = require("fs-extra");

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
            generatorBP.addModule("script", "javascript", "scripts/index");
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
