import { ModuleManager } from "../models/files/moduleManager.js";
import { getLatestPackageVersion, getInstalledPackageVersion } from "../utils/npm.js";
import { readManifest, writeManifest } from "../utils/manifest.js";
import fs from "fs";
import { ColorLogger } from "../models/cli/colorLogger.js";
import { exec } from "child_process";
import { BEHAVIOUR_PACK_PATH } from "../constants/paths.js";

ModuleManager.addModule({
    name: "npm",
    description: "Auto install npm packages",
    onLaunch: async () => {
        ColorLogger.moduleLog("Checking for npm package updates...");
        const manifest = readManifest("BP");

        if (!manifest) {
            ColorLogger.moduleLog("[NPM MODULE] No BP manifest found!");
            return;
        }

        if (!manifest.dependencies || manifest.dependencies.length === 0) {
            ColorLogger.error("No dependencies found in the manifest file.");
            return;
        }

        for (const dependency of manifest.dependencies) {
            if (dependency.uuid) continue;
            if (!dependency.version.endsWith("-beta")) {
                await tryFixStableVersion(dependency);
                continue;
            }
            const latest = await getLatestPackageVersion(dependency.module_name);

            if (latest.version === dependency.version) {
                ColorLogger.moduleLog(`The package ${dependency.module_name} is already up-to-date.`);
            } else {
                dependency.version = latest.version;
                writeManifest("BP", manifest);
                await installPackage(latest.package);
                ColorLogger.moduleLog(`Updated package ${dependency.module_name} version to ${latest.version}`);
            }
        }
    },
});

async function installPackage(packageName) {
    await initialiseNpm()
    await new Promise((resolve, reject) => {
        exec(`npm install ${packageName}`, { cwd: BEHAVIOUR_PACK_PATH }, (error, stdout, stderr) => {
            if (error) {
                ColorLogger.error(`Error installing package ${packageName}: ${error.message}`);
                return;
            }
            if (stderr) {
                ColorLogger.error(`Error installing package ${packageName}: ${stderr}`);
                return;
            }
            ColorLogger.moduleLog(`Successfully installed package ${packageName}: ${stdout}`);
            resolve();
        });
    });
}

async function initialiseNpm() {
    if (!fs.existsSync(`${BEHAVIOUR_PACK_PATH}/package.json`)) {
        ColorLogger.error("No package.json file found in the current directory.");
        await new Promise((resolve, reject) => {
            exec("npm init -y", { cwd: BEHAVIOUR_PACK_PATH }, (error, stdout, stderr) => {
                if (error) {
                    ColorLogger.error(`Error creating package.json file: ${error.message}`);
                    reject(error);
                    return;
                }
                if (stderr) {
                    ColorLogger.error(`Error creating package.json file: ${stderr}`);
                    reject(new Error(stderr));
                    return;
                }
                ColorLogger.moduleLog("Successfully created package.json file.");
                resolve();
            });
        });
    }
}

async function tryFixStableVersion(dependency) {
    await initialiseNpm();
    if (dependency.version !== getInstalledPackageVersion(dependency.module_name)?.replace("^", "")) {
        ColorLogger.moduleLog(`The package ${dependency.module_name} has a different version in the manifest than the one installed. Updating...`);
        await installPackage(dependency.module_name + "@" + dependency.version);
        ColorLogger.moduleLog(`Updated package ${dependency.module_name} version to ${dependency.version}`);
    }
}
