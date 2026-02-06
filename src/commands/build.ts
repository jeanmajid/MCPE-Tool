import { Command } from "../core/cli/command.js";
import {
    BEHAVIOUR_PACK_PATH,
    IGNORE_PATHS,
    OUTPUT_BEHAVIOUR_PACK_PATH,
    OUTPUT_RESOURCE_PACK_PATH,
    RESOURCE_PACK_PATH
} from "../core/constants/paths.js";
import fs from "fs";
import { ConfigManager } from "../core/config/configManager.js";
import { Logger } from "../core/logger/logger.js";
import type { Archiver } from "archiver";
import { Watcher } from "../core/filesystem/watcher.js";

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

        const isRP: boolean = fs.existsSync(RESOURCE_PACK_PATH);
        const isBP: boolean = fs.existsSync(BEHAVIOUR_PACK_PATH);

        if (!isRP && !isBP) {
            Logger.error("No BP or RP folder found. Please create one of them.");
            return;
        }

        const watcher = (await Command.execute("watch", "", [])) as Watcher;

        let lastTransferNumber = watcher.lastTransfer;
        let stableStartTime = Date.now();

        while (true) {
            await new Promise((resolve) => setTimeout(resolve, 100));

            if (watcher.lastTransfer === lastTransferNumber) {
                // wait 5 seconds, bcs im too lazy rn to handle awaiting of ts module
                if (Date.now() - stableStartTime >= 5000) {
                    break;
                }
            } else {
                lastTransferNumber = watcher.lastTransfer;
                stableStartTime = Date.now();
            }
        }

        const { glob } = await import("glob");
        const { default: archiver } = await import("archiver");

        fs.mkdirSync("dist", { recursive: true });

        function getPathsRelativeToRoot(paths: string[], rootName: string): string[] {
            return paths.map((path) => {
                const parts = path.split(/[/\\]/);
                const rootIndex = parts.indexOf(rootName);

                if (rootIndex !== -1 && rootIndex < parts.length - 1) {
                    return parts.slice(rootIndex + 1).join("/");
                }

                return path;
            });
        }

        if (isBP) {
            Logger.info("Creating BP .mcpack file...");

            // Not using path.join, as glob only accepts / and not \
            const bpFiles: string[] = glob.sync(OUTPUT_BEHAVIOUR_PACK_PATH + "/**/*", {
                ignore: IGNORE_PATHS,
                nodir: true
            });
            const relativePaths = getPathsRelativeToRoot(bpFiles, config.name + "BP");

            const paths: FileMapping[] = relativePaths.map((file: string, index: number) => {
                return {
                    filePath: bpFiles[index],
                    outputPath: file
                };
            });

            const bpBuffer: Buffer = await zipFiles(paths, archiver);
            fs.writeFileSync(`./dist/${config.name}BP.mcpack`, bpBuffer);
        }

        if (isRP) {
            Logger.info("Creating RP .mcpack file...");

            // Not using path.join, as glob only accepts / and not \
            const rpFiles: string[] = glob.sync(OUTPUT_RESOURCE_PACK_PATH + "/**/*", {
                ignore: IGNORE_PATHS,
                nodir: true
            });
            const relativePaths = getPathsRelativeToRoot(rpFiles, config.name + "RP");

            const paths: FileMapping[] = relativePaths.map((file: string, index: number) => {
                return {
                    filePath: rpFiles[index],
                    outputPath: file
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

        watcher.stopWatching();
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
