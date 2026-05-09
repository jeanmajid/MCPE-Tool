import { ChildProcess } from "node:child_process";

import { ConfigManager } from "../core/config/configManager.js";
import { validPackageNames } from "../core/constants/validMcpePackages.js";
import { VALID_MCPE_PACKAGES } from "../core/constants/validMcpePackages.js";
import { HAS_INTERNET } from "../core/constants/wifi.js";
import { Logger } from "../core/logger/logger.js";
import { BaseModule } from "../core/modules/baseModule.js";
import { ModuleManager } from "../core/modules/moduleManager.js";
import { ManifestDependency, readManifest, writeManifest } from "../utils/manifest.js";
import {
    getInstalledPackageVersion,
    initializeNPM,
    installPackage,
    getLatestPackageVersion,
} from "../utils/npm.js";

class NpmModule extends BaseModule {
    public name: string = "npm";
    public description: string = "Auto install npm packages";
    public watchProcess: ChildProcess | undefined;
    public packageManager: string = "npm";

    public async onLaunch(): Promise<void> {
        if (!HAS_INTERNET) {
            Logger.moduleLog(
                "[NPM MODULE] Skipping npm package checks - no internet connection available"
            );
            return;
        }
        await initializeNPM(".", this.packageManager);
        Logger.moduleLog("Checking for npm package updates...");
        const manifest = readManifest("BP");

        if (!manifest) {
            Logger.moduleLog("[NPM MODULE] No BP manifest found!");
            return;
        }

        if (!manifest.dependencies || manifest.dependencies.length === 0) {
            Logger.error("[NPM MODULE] No dependencies found in the manifest file.");
            return;
        }

        const config = ConfigManager.readConfig();

        for (const dependency of manifest.dependencies) {
            if (dependency.uuid) {
                continue;
            }
            if (!dependency.version.endsWith("-beta")) {
                await this.tryFixStableVersion(dependency);
                continue;
            }

            if (!dependency.module_name || !VALID_MCPE_PACKAGES.includes(dependency.module_name)) {
                Logger.error(`[NPM MODULE] Unsupported package: ${dependency.module_name}`);
                continue;
            }
            let latest: Awaited<ReturnType<typeof getLatestPackageVersion>>;
            if (config.output === "preview") {
                latest = await getLatestPackageVersion(dependency.module_name, name =>
                    name.includes("preview")
                );
            } else {
                latest = await getLatestPackageVersion(dependency.module_name, name =>
                    name.includes("stable")
                );
            }

            if (!latest) {
                Logger.error(
                    `[NPM MODULE] Failed to fetch latest version for package: ${dependency.module_name}`
                );
                continue;
            }

            if (
                latest.version === dependency.version &&
                latest.package.split("@")[2] ===
                    getInstalledPackageVersion(dependency.module_name)?.replace("^", "")
            ) {
                Logger.moduleLog(
                    `[NPM MODULE] The package ${dependency.module_name} is already up-to-date.`
                );
            } else {
                dependency.version = latest.version;
                writeManifest("BP", manifest);
                await installPackage(latest.package, ".", this.packageManager);
                Logger.moduleLog(
                    `[NPM MODULE] Updated package ${dependency.module_name} version to ${latest.version}`
                );
            }
        }
    }

    public async tryFixStableVersion(dependency: ManifestDependency): Promise<void> {
        await initializeNPM(".", this.packageManager);
        if (
            dependency.module_name &&
            dependency.version !==
                getInstalledPackageVersion(dependency.module_name)?.replace("^", "")
        ) {
            Logger.moduleLog(
                `[NPM MODULE] The package ${dependency.module_name} has a different version in the manifest than the one installed. Updating...`
            );
            await installPackage(
                (dependency.module_name + "@" + dependency.version) as validPackageNames,
                ".",
                this.packageManager
            );
            Logger.moduleLog(
                `[NPM MODULE] Updated package ${dependency.module_name} version to ${dependency.version}`
            );
        }
    }
}

class PnpmModule extends NpmModule {
    public name: string = "pnpm";
    public description: string = "Auto install npm packages via PNPM";
    public packageManager: string = "pnpm";
}

ModuleManager.registerModule(new NpmModule());
ModuleManager.registerModule(new PnpmModule());
