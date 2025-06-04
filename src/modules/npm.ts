import { ModuleManager } from "./../core/modules/moduleManager";
import {
    getLatestPackageVersion,
    getInstalledPackageVersion,
    validPackageNames
} from "../utils/npm.js";
import fs from "fs";
import { exec } from "child_process";
import { Logger } from "../core/logger/logger.js";
import { BEHAVIOUR_PACK_PATH } from "../core/constants/paths.js";
import { ManifestDependency, readManifest, writeManifest } from "../utils/manifest.js";

ModuleManager.addModule({
    name: "npm",
    description: "Auto install npm packages",
    onLaunch: async () => {
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
                await tryFixStableVersion(dependency);
                continue;
            }
            if (
                !dependency.module_name ||
                (dependency.module_name !== "@minecraft/server" &&
                    dependency.module_name !== "@minecraft/server-ui")
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
                await installPackage(latest.package);
                Logger.moduleLog(
                    `Updated package ${dependency.module_name} version to ${latest.version}`
                );
            }
        }
    }
});

async function installPackage(packageName: validPackageNames): Promise<void> {
    await initialiseNpm();
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

async function initialiseNpm(): Promise<void> {
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

async function tryFixStableVersion(dependency: ManifestDependency): Promise<void> {
    await initialiseNpm();
    if (
        dependency.module_name &&
        dependency.version !== getInstalledPackageVersion(dependency.module_name)?.replace("^", "")
    ) {
        Logger.moduleLog(
            `The package ${dependency.module_name} has a different version in the manifest than the one installed. Updating...`
        );
        await installPackage(
            (dependency.module_name + "@" + dependency.version) as validPackageNames
        );
        Logger.moduleLog(
            `Updated package ${dependency.module_name} version to ${dependency.version}`
        );
    }
}
