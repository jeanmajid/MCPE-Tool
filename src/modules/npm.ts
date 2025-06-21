import { ChildProcess, exec } from "child_process";
import fs from "fs";
import { Logger } from "../core/logger/logger.js";
import { ModuleManager } from "../core/modules/moduleManager.js";
import { BaseModule } from "../core/modules/baseModule.js";
import {
    getLatestPackageVersion,
    getInstalledPackageVersion,
    validPackageNames
} from "../utils/npm.js";
import { BEHAVIOUR_PACK_PATH } from "../core/constants/paths.js";
import { ManifestDependency, readManifest, writeManifest } from "../utils/manifest.js";

class NpmModule extends BaseModule {
    name: string = "npm";
    description: string = "Auto install npm packages";
    watchProcess: ChildProcess | undefined;

    async onLaunch(): Promise<void> {
        Logger.moduleLog("Checking for npm package updates...");
        const manifest = readManifest("BP");

        if (!manifest) {
            Logger.moduleLog("[NPM MODULE] No BP manifest found!");
            return;
        }

        if (!manifest.dependencies || manifest.dependencies.length === 0) {
            Logger.error("No dependencies found in the manifest file.");
            return;
        }

        for (const dependency of manifest.dependencies) {
            if (dependency.uuid) continue;
            if (!dependency.version.endsWith("-beta")) {
                await this.tryFixStableVersion(dependency);
                continue;
            }
            if (
                !dependency.module_name ||
                (dependency.module_name !== "@minecraft/server" &&
                    dependency.module_name !== "@minecraft/server-ui") // TODO: use an array and include all modules
            ) {
                Logger.error(`Unsupported package: ${dependency.module_name}`);
                continue;
            }
            const latest = await getLatestPackageVersion(dependency.module_name);

            if (!latest) {
                Logger.error(
                    `Failed to fetch latest version for package: ${dependency.module_name}`
                );
                continue;
            }

            if (latest.version === dependency.version) {
                Logger.moduleLog(`The package ${dependency.module_name} is already up-to-date.`);
            } else {
                dependency.version = latest.version;
                writeManifest("BP", manifest);
                await this.installPackage(latest.package);
                Logger.moduleLog(
                    `Updated package ${dependency.module_name} version to ${latest.version}`
                );
            }
        }
    }

    async installPackage(packageName: validPackageNames): Promise<void> {
        await this.initialiseNpm();
        await new Promise<void>((resolve) => {
            exec(
                `npm install ${packageName}`,
                { cwd: BEHAVIOUR_PACK_PATH },
                (error, stdout, stderr) => {
                    if (error) {
                        Logger.error(`Error installing package ${packageName}: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        Logger.error(`Error installing package ${packageName}: ${stderr}`);
                        return;
                    }
                    Logger.moduleLog(`Successfully installed package ${packageName}: ${stdout}`);
                    resolve();
                }
            );
        });
    }

    async initialiseNpm(): Promise<void> {
        if (!fs.existsSync(`${BEHAVIOUR_PACK_PATH}/package.json`)) {
            Logger.error("No package.json file found in the current directory.");
            await new Promise<void>((resolve, reject) => {
                exec("npm init -y", { cwd: BEHAVIOUR_PACK_PATH }, (error, stdout, stderr) => {
                    if (error) {
                        Logger.error(`Error creating package.json file: ${error.message}`);
                        reject(error);
                        return;
                    }
                    if (stderr) {
                        Logger.error(`Error creating package.json file: ${stderr}`);
                        reject(new Error(stderr));
                        return;
                    }
                    Logger.moduleLog("Successfully created package.json file.");
                    resolve();
                });
            });
        }
    }

    async tryFixStableVersion(dependency: ManifestDependency): Promise<void> {
        await this.initialiseNpm();
        if (
            dependency.module_name &&
            dependency.version !==
                getInstalledPackageVersion(dependency.module_name)?.replace("^", "")
        ) {
            Logger.moduleLog(
                `The package ${dependency.module_name} has a different version in the manifest than the one installed. Updating...`
            );
            await this.installPackage(
                (dependency.module_name + "@" + dependency.version) as validPackageNames
            );
            Logger.moduleLog(
                `Updated package ${dependency.module_name} version to ${dependency.version}`
            );
        }
    }
}

ModuleManager.registerModule(new NpmModule());
