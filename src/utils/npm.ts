import fs from "fs";
import { PROJECT_PATH } from "../core/constants/paths.js";
import { Logger } from "../core/logger/logger.js";
import { exec } from "child_process";
import { HAS_INTERNET } from "../core/constants/wifi.js";
import { validPackageNames } from "./../core/constants/validMcpePackages.js";
import path from "path";

/**
 * Fetches the versions of a given package from the npm registry.
 * @param packageName - The name of the package.
 * @returns A promise that resolves to an array of package versions.
 */
export async function getPackageVersions(packageName: string): Promise<string[] | undefined> {
    if (!HAS_INTERNET) {
        Logger.error("No internet connection available. Cannot fetch package versions.");
        return undefined;
    }
    try {
        const response = await fetch(`https://registry.npmjs.org/${packageName}`);
        const data = await response.json();
        const versions = Object.keys(data.versions);
        return versions;
    } catch (error) {
        console.error(`Error fetching versions for package ${packageName}:`, error);
        return undefined;
    }
}

/**
 * Retrieves the latest version of a mcpe package.
 * @param packageName - The name of the package.
 * @returns A promise that resolves to an object containing the latest version and package name.
 */
export async function getLatestPackageVersion(
    packageName: validPackageNames,
    nameFilter?: (name: string) => boolean
): Promise<{ version: string; package: validPackageNames } | undefined> {
    let versions = await getPackageVersions(packageName);
    if (!versions) {
        return undefined;
    }

    if (nameFilter) {
        versions = versions.filter(nameFilter);
    }
    const latest = versions[versions.length - 1];

    return {
        version: latest.split(".").splice(0, 3).join("."),
        package: (packageName + "@" + latest) as validPackageNames
    };
}

/**
 * Retrieves the latest version of a mcpe package.
 * @param packageName - The name of the package.
 * @returns A promise that resolves to an object containing the latest version and package name.
 */
export async function getLatestStablePackageVersion(
    packageName: validPackageNames
): Promise<{ version: string; package: validPackageNames } | undefined> {
    return getLatestPackageVersion(packageName, (version) => version.includes("stable"));
}

/**
 * Retrieves the version of an installed package.
 * @param packageName - The name of the package.
 * @returns The version of the package.
 */
export function getInstalledPackageVersion(packageName: string, cwd = "."): string | undefined {
    const packageJson = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf8"));
    const dependencies = packageJson.dependencies || {};
    return dependencies[packageName];
}

export async function installPackage(packageName: string | string[], cwd = "."): Promise<boolean> {
    await initialiseNpm(cwd);
    return await new Promise<boolean>((resolve) => {
        if (!HAS_INTERNET) {
            Logger.error(
                `Failed to install package ${packageName} - no internet connection available`
            );
            process.exit(1);
        }
        const packages = typeof packageName === "string" ? packageName : packageName.join(" ");
        // the current version of the @minecraft packages is broken, use this while its not fixed
        exec(`npm install --force ${packages}`, { cwd }, (error, stdout, stderr) => {
            if (error) {
                Logger.error(`Error installing package ${packageName}: ${error.message}`);
                resolve(false);
                return;
            }
            if (stderr) {
                Logger.error(`Error installing package ${packageName}: ${stderr}`);
                resolve(false);
                return;
            }
            Logger.moduleLog(`Successfully installed package ${packageName}: ${stdout}`);
            resolve(true);
        });
    });
}

export async function initialiseNpm(cwd = "."): Promise<void> {
    if (!fs.existsSync(path.join(cwd, "package.json"))) {
        Logger.error("No package.json file found in the current directory.");
        await new Promise<void>((resolve, reject) => {
            exec("npm init -y", { cwd }, (error, stdout, stderr) => {
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

// This function is unused currently
/**
 * Dynamically imports a package, installing it first if it's not already installed.
 *
 * This function checks if the specified package is already installed in the project.
 * If not, it attempts to install the package before importing it. If installation
 * fails, the process will exit with code 1.
 *
 * @param packageName - The name of the npm package to import
 * @returns A promise that resolves to the imported module
 *
 * @example
 * ```typescript
 * const glob = (await dynamicImport("glob")) as typeof import("glob");
 * ```
 *
 * @throws Will exit the process if package installation fails
 */
export async function dynamicImport(packageName: string): Promise<unknown> {
    const packageBaseName =
        packageName.split("@")[0] === ""
            ? "@" + packageName.split("@")[1]
            : packageName.split("@")[0];
    if (getInstalledPackageVersion(packageBaseName, PROJECT_PATH)) {
        return await import(packageBaseName);
    }
    const res = await installPackage(packageBaseName, PROJECT_PATH);

    if (!res) {
        Logger.error(`Failed to install package ${packageBaseName}`);
        process.exit(1);
    }

    return await import(packageBaseName);
}
