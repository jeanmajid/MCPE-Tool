import { Logger } from "../core/logger/logger.js";
import { Command } from "../core/cli/command.js";
import { PROJECT_PATH } from "../core/constants/paths.js";
import { execSync } from "child_process";
import { existsSync } from "fs";

Command.command("update")
    .description("Updates the tool to the newest version")
    .action(async () => {
        // We are just checking if the src folder exists, bcs people that install it from npm don't have it
        const isInstalledFromSource = existsSync("./src");

        if (isInstalledFromSource) {
            try {
                Logger.info("Updating from git repository...");

                process.chdir(PROJECT_PATH);
                execSync("git pull origin main", { stdio: "inherit" });
                execSync("install.bat -y", { stdio: "inherit" });

                Logger.success("Update completed!");
            } catch (error) {
                if (error instanceof Error) {
                    Logger.error("Failed to update:" + error.message);
                }
                Logger.info("Try running 'git pull' manually in the project directory");
            }
        } else {
            Logger.info("Updating from npm..."); // TODO: message does not get displayed, bcs npm eats the terminal
            execSync("npm update -g @jeanmajid/mcpe-tool", { stdio: "inherit" });
        }
    });
