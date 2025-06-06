import fs from "fs";
import { spawn } from "child_process";
import { Logger } from "../core/logger/logger.js";
import { Command } from "../core/cli/command.js";
import { EXTERNAL_PATHS } from "../core/constants/paths.js";

Command.command("translate")
    .description("translates into all available languages")
    .action(async () => {
        const mainLangFilePath = "./RP/texts/en_US.lang";
        if (!fs.existsSync(mainLangFilePath)) {
            Logger.error(`Make sure to create and lang file at ${mainLangFilePath} with some keys`);
            return;
        }
        Logger.info("Starting to translate all lang keys...");
        const script = spawn("python", ["-u", EXTERNAL_PATHS.TRANSLATE_PYTHON], {
            cwd: ".",
            env: { ...process.env, PYTHONIOENCODING: "utf-8" }
        });
        script.stdout.on("data", (data) => {
            Logger.info(data.toString());
        });
        script.stderr.on("data", (data) => {
            if (data.toString().includes("FutureWarning")) return;
            Logger.error(data.toString());
        });
        script.on("close", (code) => {
            Logger.info(`Translation script exited with code ${code}`);
        });
    });
