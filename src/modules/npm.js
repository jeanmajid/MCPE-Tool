const { ModuleManager } = require("../models/files/moduleManager");
const { getLatestPackageVersion } = require("../utils/npm");
const { readManifest, writeManifest } = require("../utils/manifest");
const fs = require("fs");
const { ColorLogger } = require("../models/cli/colorLogger");
const { exec } = require("child_process");

ModuleManager.addModule({
    name: "npm",
    description: "Auto install npm packages",
    onLaunch: async (filePath) => {
        ColorLogger.moduleLog("Checking for npm package updates...");
        const manifest = readManifest("BP");

        if (!manifest.dependencies || manifest.dependencies.length === 0) {
            ColorLogger.error("No dependencies found in the manifest file.");
            return;
        }

        for (const dependency of manifest.dependencies) {
            if (!dependency.version.endsWith("-beta")) return;
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
    const bpDir = "./BP";
    if (!fs.existsSync(`${bpDir}/package.json`)) {
        ColorLogger.error("No package.json file found in the current directory.");
        exec("npm init -y", {cwd: bpDir}, (error, stdout, stderr) => {
            if (error) {
                ColorLogger.error(`Error creating package.json file: ${error.message}`);
                return;
            }
            if (stderr) {
                ColorLogger.error(`Error creating package.json file: ${stderr}`);
                return;
            }
            ColorLogger.moduleLog("Successfully created package.json file.");
        });
        await new Promise(r => setTimeout(r, 1000));
    }
    exec(`npm install ${packageName}`, { cwd: bpDir }, (error, stdout, stderr) => {
        if (error) {
            ColorLogger.error(`Error installing package ${packageName}: ${error.message}`);
            return;
        }
        if (stderr) {
            ColorLogger.error(`Error installing package ${packageName}: ${stderr}`);
            return;
        }
        ColorLogger.moduleLog(`Successfully installed package ${packageName}: ${stdout}`);
    });
}
