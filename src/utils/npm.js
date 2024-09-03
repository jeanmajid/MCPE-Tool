/**
 * Fetches the versions of a given package from the npm registry.
 * @param {string} packageName - The name of the package.
 * @returns {Promise<string[]>} - A promise that resolves to an array of package versions.
 */
async function getPackageVersions(packageName) {
    try {
        const response = await fetch(`https://registry.npmjs.org/${packageName}`);
        const data = await response.json();
        const versions = Object.keys(data.versions);
        return versions;
    } catch (error) {
        console.error(`Error fetching versions for package ${packageName}:`, error);
    }
}

/**
 * Retrieves the latest version of a mcpe package.
 * @param {"@minecraft/server" | "@minecraft/server-ui"} packageName - The name of the package.
 * @returns {Promise<{ version: string, package: string }>} - A promise that resolves to an object containing the latest version and package name.
 */
async function getLatestPackageVersion(packageName) {
    let versions = await getPackageVersions(packageName);
    versions = versions.filter((version) => version.includes("stable"));
    const latest = versions[versions.length - 1];

    return { version: latest.split(".").splice(0, 3).join("."), package: packageName + "@" + latest };
}

module.exports = {
    getPackageVersions,
    getLatestPackageVersion,
};
