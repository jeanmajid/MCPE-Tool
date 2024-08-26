const { ModuleManager } = require("../models/files/moduleManager");
const { getLatestPackageVersion } = require("../utils/npm");
const { readManifest, writeManifest } = require("../utils/manifest");
const fs = require("fs");
const { ColorLogger } = require("../models/cli/colorLogger");

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
        if (!manifest.dependencies[0].version.endsWith("-beta")) return;
        const latest = await getLatestPackageVersion("@minecraft/server");

        if (latest.version === manifest.dependencies[0].version) {
            ColorLogger.moduleLog("The package is already up-to-date.");
        } else {
            manifest.dependencies[0].version = latest.version;
            writeManifest("BP", manifest);
            ColorLogger.moduleLog(`Updated package ${manifest.dependencies[0].module_name} version to ${latest.version}`);
        }
    },
});
