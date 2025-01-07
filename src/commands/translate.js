const { program } = require("../main");
const { ColorLogger } = require("../models/cli/colorLogger");
const fs = require("fs");
const { spawn } = require("child_process");

program
    .command("translate")
    .description("translates into all available languages")
    .action(async () => {
        const mainLangFilePath = "./RP/texts/en_US.lang";
        if (!fs.existsSync(mainLangFilePath)) {
            ColorLogger.error(`Make sure to create and lang file at ${mainLangFilePath} with some keys`);
            return;
        }
        ColorLogger.info("Starting to translate all lang keys...");
        const script = spawn("python", ["-u", "C:/Users/jeanh/OneDrive/Dokumente/GitHub/MCPE-Tool/external/translate/translateProject.py"], { cwd: ".", env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
        script.stdout.on("data", (data) => {
            ColorLogger.info(data.toString());
        });
        script.stderr.on("data", (data) => {
            if (data.toString().includes("FutureWarning")) return;
            ColorLogger.error(data.toString());
        });
        script.on("close", (code) => {
            ColorLogger.info(`Translation script exited with code ${code}`);
        });
    });
