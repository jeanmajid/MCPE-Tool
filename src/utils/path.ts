/**
 * Checks if a file path has the specified extension
 * @param filePath - The file path to check
 * @param extension - The extension to check for (e.g., '.txt')
 * @returns True if the file path ends with the extension
 */
export function pathHasExtension(filePath: string, extension: string): boolean {
    return filePath.endsWith(extension);
}

/**
 * Checks if a file path has any of the specified extensions
 * @param filePath - The file path to check
 * @param extensions - Array of extensions to check for
 * @returns True if the file path ends with any of the extensions
 */
export function pathHasAnyExtension(filePath: string, ...extensions: string[]): boolean {
    return extensions.some((ext) => filePath.endsWith(ext));
}

/**
 * Checks if a file path is within the specified directory
 * @param filePath - The file path to check
 * @param dirName - The directory name to check for
 * @returns True if the file path contains the directory
 */
export function pathIsInDirectory(filePath: string, dirName: string): boolean {
    return filePath.includes(`/${dirName}/`) || filePath.includes(`\\${dirName}\\`);
}
