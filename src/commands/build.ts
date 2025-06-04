import { Command } from "./../core/cli/command";
import { IGNORE_PATHS } from "../core/constants/paths";
import fs from "fs";
import { ConfigManager } from "../core/config/configManager.js";
import { Logger } from "../core/logger/logger.js";
import type { Archiver } from "archiver";

interface FileMapping {
    filePath: string;
    outputPath: string;
}

Command.command("build")
    .description("Build the project, based on the modules, into .mcpack or .mcaddon")
    .action(async () => {
        const config = ConfigManager.readConfig();
        if (!config.id) {
            Logger.error(
                'No config file found. Run "mc init" or if you already have a project run "mc repair".'
            );
            return;
        }

        const isRP: boolean = fs.existsSync("./RP");
        const isBP: boolean = fs.existsSync("./BP");

        if (!isRP && !isBP) {
            Logger.error("No BP or RP folder found. Please create one of them.");
            return;
        }

        const { glob } = await import("glob");
        const { default: archiver } = await import("archiver");

        fs.mkdirSync("dist", { recursive: true });

        if (isBP) {
            Logger.info("Creating BP .mcpack file...");

            const bpFiles: string[] = glob.sync("BP/**/*", { ignore: IGNORE_PATHS, nodir: true });
            const paths: FileMapping[] = bpFiles.map((file: string) => {
                return {
                    filePath: file,
                    outputPath: file.slice(3)
                };
            });

            const bpBuffer: Buffer = await zipFiles(paths, archiver);
            fs.writeFileSync(`./dist/${config.name}BP.mcpack`, bpBuffer);
        }

        if (isRP) {
            Logger.info("Creating RP .mcpack file...");

            const rpFiles: string[] = glob.sync("RP/**/*", { ignore: IGNORE_PATHS, nodir: true });
            const paths: FileMapping[] = rpFiles.map((file: string) => {
                return {
                    filePath: file,
                    outputPath: file.slice(3)
                };
            });

            const rpBuffer: Buffer = await zipFiles(paths, archiver);
            fs.writeFileSync(`./dist/${config.name}RP.mcpack`, rpBuffer);
        }

        if (isBP && isRP) {
            Logger.info("Creating .mcaddon file...");

            const paths: FileMapping[] = [
                `./dist/${config.name}BP.mcpack`,
                `./dist/${config.name}RP.mcpack`
            ].map((file: string) => {
                return {
                    filePath: file,
                    outputPath: file.slice(7)
                };
            });

            const addonBuffer: Buffer = await zipFiles(paths, archiver);
            fs.writeFileSync(`./dist/${config.name}.mcaddon`, addonBuffer);
        }
    });

function zipFiles(files: FileMapping[], archiver: typeof import("archiver")): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const archive: Archiver = archiver("zip", { zlib: { level: 9 } });
        const buffers: Buffer[] = [];

        archive.on("data", (data: Buffer) => buffers.push(data));
        archive.on("end", () => resolve(Buffer.concat(buffers)));
        archive.on("error", (err: Error) => reject(err));

        for (const { filePath, outputPath } of files) {
            archive.file(filePath, { name: outputPath });
        }

        archive.finalize();
    });
}
