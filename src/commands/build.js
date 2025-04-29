import { IGNORE_PATHS } from "../constants/paths.js";
import { readConfig } from "../utils/config.js";
import fs from "fs";
import { ColorLogger } from "../models/cli/colorLogger.js";
import { Command } from "../models/cli/command.js";

Command.command("build")
    .description("Build the project, based on the modules, into .mcpack or .mcaddon")
    .action(async () => {
        const config = readConfig();
        if (!config.id) {
            ColorLogger.error('No config file found. Run "mc init" or if you already have a project run "mc repair".');
            return;
        }

        const isRP = fs.existsSync("./RP");
        const isBP = fs.existsSync("./BP");

        if (!isRP && !isBP) {
            ColorLogger.error("No BP or RP folder found. Please create one of them.");
            return;
        }

        const { glob } = await import("glob");
        const { default: archiver } = await import("archiver");

        fs.mkdirSync("dist", { recursive: true });

        if (isBP) {
            ColorLogger.info("Creating BP .mcpack file...");

            const bpFiles = glob.sync("BP/**/*", { ignore: IGNORE_PATHS, nodir: true });
            const paths = bpFiles.map((file) => {
                return {
                    filePath: file,
                    outputPath: file.slice(3),
                };
            });

            const bpBuffer = await zipFiles(paths, archiver);
            fs.writeFileSync(`./dist/${config.name}BP.mcpack`, bpBuffer);
        }

        if (isRP) {
            ColorLogger.info("Creating RP .mcpack file...");

            const rpFiles = glob.sync("RP/**/*", { ignore: IGNORE_PATHS, nodir: true });
            const paths = rpFiles.map((file) => {
                return {
                    filePath: file,
                    outputPath: file.slice(3),
                };
            });

            const rpBuffer = await zipFiles(paths, archiver);
            fs.writeFileSync(`./dist/${config.name}RP.mcpack`, rpBuffer);
        }

        if (isBP && isRP) {
            ColorLogger.info("Creating .mcaddon file...");

            const paths = [`./dist/${config.name}BP.mcpack`, `./dist/${config.name}RP.mcpack`].map((file) => {
                return {
                    filePath: file,
                    outputPath: file.slice(7),
                };
            });

            const addonBuffer = await zipFiles(paths, archiver);
            fs.writeFileSync(`./dist/${config.name}.mcaddon`, addonBuffer);
        }
    });

function zipFiles(files, archiver) {
    return new Promise((resolve, reject) => {
        const archive = archiver("zip", { zlib: { level: 9 } });
        const buffers = [];

        archive.on("data", (data) => buffers.push(data));
        archive.on("end", () => resolve(Buffer.concat(buffers)));
        archive.on("error", (err) => reject(err));

        for (const { filePath, outputPath } of files) {
            archive.file(filePath, { name: outputPath });
        }

        archive.finalize();
    });
}
