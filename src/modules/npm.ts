import { validPackageNames } from "../core/constants/validMcpePackages.js";
import { ChildProcess } from "child_process";
import { Logger } from "../core/logger/logger.js";
import { ModuleManager } from "../core/modules/moduleManager.js";
import { BaseModule } from "../core/modules/baseModule.js";
import {
    getLatestStablePackageVersion,
    getInstalledPackageVersion,
    initialiseNpm,
    installPackage,
    getLatestPackageVersion
} from "../utils/npm.js";
import { ManifestDependency, readManifest, writeManifest } from "../utils/manifest.js";
import { HAS_INTERNET } from "../core/constants/wifi.js";
import { ConfigManager } from "../core/config/configManager.js";
import { VALID_MCPE_PACKAGES } from "../core/constants/validMcpePackages.js";

class NpmModule extends BaseModule {
    name: string = "npm";
    description: string = "Auto install npm packages";
    watchProcess: ChildProcess | undefined;

    async onLaunch(): Promise<void> {
        if (!HAS_INTERNET) {
            Logger.moduleLog(
                "[NPM MODULE] Skipping npm package checks - no internet connection available"
            );
            return;
        }
        await initialiseNpm();
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
                latest = await getLatestPackageVersion(dependency.module_name);
            } else {
                latest = await getLatestStablePackageVersion(dependency.module_name);
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
                await installPackage(latest.package);
                Logger.moduleLog(
                    `[NPM MODULE] Updated package ${dependency.module_name} version to ${latest.version}`
                );
            }
        }
    }

    async tryFixStableVersion(dependency: ManifestDependency): Promise<void> {
        await initialiseNpm();
        if (
            dependency.module_name &&
            dependency.version !==
                getInstalledPackageVersion(dependency.module_name)?.replace("^", "")
        ) {
            Logger.moduleLog(
                `[NPM MODULE] The package ${dependency.module_name} has a different version in the manifest than the one installed. Updating...`
            );
            await installPackage(
                (dependency.module_name + "@" + dependency.version) as validPackageNames
            );
            Logger.moduleLog(
                `[NPM MODULE] Updated package ${dependency.module_name} version to ${dependency.version}`
            );
        }
    }
}

ModuleManager.registerModule(new NpmModule());
