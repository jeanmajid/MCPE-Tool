import { Questioner } from "../core/cli/questioner.js";
import fs, { copyFileSync, existsSync, mkdirSync } from "fs";
import { generateUniqueId } from "../utils/id.js";
import { Command } from "../core/cli/command.js";
import { ConfigManager } from "../core/config/configManager.js";
import { Logger } from "../core/logger/logger.js";
import { ManifestGenerator } from "../core/generators/manifestGenerator.js";
import path from "path";
import { PROJECT_PATH, PROJECT_PATH_SRC } from "../core/constants/paths.js";
import { pathToFileURL } from "url";
import { installPackage } from "../utils/npm.js";

Command.command("init")
    .description("Initialize the project with interactive prompts")
    .action(async () => {
        if (ConfigManager.readConfig().id) {
            Logger.error(
                "Project already initialized. Please remove the config file to reinitialize the project."
            );
            return;
        }
        const answers = await Questioner.prompt([
            {
                type: "input",
                name: "projectName",
                message: "Project name:",
                default: (): string => process.cwd().split(/[/\\]/).pop() as string
            },
            {
                type: "input",
                name: "projectDescription",
                message: "Project description:",
                default: (): string => ""
            },
            {
                type: "confirm",
                name: "behaviourPack",
                message: "Behaviour pack?",
                default: (): boolean => true
            },
            {
                type: "confirm",
                name: "resourcePack",
                message: "Resource pack?",
                default: (): boolean => false
            },
            {
                type: "input",
                name: "author",
                message: "Project Author",
                default: (): string => ""
            },
            {
                type: "confirm",
                name: "eslint",
                message: "Eslint?",
                default: (): boolean => false
            }
        ]);
        Logger.info(`Initializing project: ${answers.projectName}`);
        const generatorRP = new ManifestGenerator(
            answers.projectName as string,
            answers.projectDescription as string
        );
        const generatorBP = new ManifestGenerator(
            answers.projectName as string,
            answers.projectDescription as string
        );
        if (answers.behaviourPack) {
            Logger.info("Creating behaviour pack...");
            fs.mkdirSync("BP", { recursive: true });

            generatorBP.addModule("data");
            generatorBP.addModule("script", "javascript", "scripts/index.js");
            if (answers.author) {
                generatorBP.addAuthor(answers.author as string);
            }
            generatorBP.addDependency("@minecraft/server", "1.0.0-beta");
            generatorBP.addDependency("@minecraft/server-ui", "1.0.0-beta");

            if (answers.resourcePack) generatorBP.addDependencyUUID(generatorRP.mainUUID, "1.0.0");

            fs.writeFileSync("BP/manifest.json", generatorBP.generateString());

            Logger.info("Creating scripts folder...");
            fs.mkdirSync("BP/scripts", { recursive: true });
            fs.writeFileSync("BP/scripts/index.js", "");
        }
        if (answers.resourcePack) {
            Logger.info("Creating resource pack...");
            fs.mkdirSync("RP", { recursive: true });

            generatorRP.addModule("resources");
            if (answers.author) {
                generatorRP.addAuthor(answers.author as string);
            }

            if (answers.behaviourPack) generatorRP.addDependencyUUID(generatorBP.mainUUID, "1.0.0");

            fs.writeFileSync("RP/manifest.json", generatorRP.generateString());
        }

        if (answers.eslint) {
            const eslintPackages = [
                "eslint-config-prettier",
                "eslint-plugin-prettier",
                "prettier",
                "@typescript-eslint/eslint-plugin",
                "@typescript-eslint/parser"
            ];

            copyFileSync(path.join(PROJECT_PATH, "eslint.config.js"), "./eslint.config.js");
            if (!existsSync("./.vscode")) mkdirSync("./.vscode");
            copyFileSync(
                path.join(PROJECT_PATH, ".vscode/settings.json"),
                "./.vscode/settings.json"
            );

            await installPackage(eslintPackages);
        }

        Logger.info("Creating config file...");
        fs.writeFileSync(
            "./config.json",
            JSON.stringify(
                {
                    $schema: pathToFileURL(
                        path.join(PROJECT_PATH_SRC, "core", "config", "mcConfigSchema.json")
                    ),
                    name: answers.projectName,
                    description: answers.projectDescription,
                    modules: ["npm"],
                    id: generateUniqueId()
                },
                null,
                4
            )
        );

        Logger.success("Project initialized!");
    });
