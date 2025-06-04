import fs from "fs";
import { BEHAVIOUR_PACK_PATH } from "../core/constants/paths.js";

export type validPackageNames = "@minecraft/server" | "@minecraft/server-ui";

/**
 * Fetches the versions of a given package from the npm registry.
 * @param packageName - The name of the package.
 * @returns A promise that resolves to an array of package versions.
 */
export async function getPackageVersions(packageName: string): Promise<string[] | undefined> {
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
    packageName: validPackageNames
): Promise<{ version: string; package: validPackageNames } | undefined> {
    const versions = await getPackageVersions(packageName);
    if (!versions) return undefined;

    const stableVersions = versions.filter((version) => version.includes("stable"));
    const latest = stableVersions[stableVersions.length - 1];

    return {
        version: latest.split(".").splice(0, 3).join("."),
        package: (packageName + "@" + latest) as validPackageNames
    };
}

/**
 * Retrieves the version of an installed package.
 * @param packageName - The name of the package.
 * @returns The version of the package.
 */
export function getInstalledPackageVersion(packageName: validPackageNames): string | undefined {
    const packageJson = JSON.parse(fs.readFileSync(`${BEHAVIOUR_PACK_PATH}/package.json`, "utf8"));
    const dependencies = packageJson.dependencies || {};
    return dependencies[packageName];
}
