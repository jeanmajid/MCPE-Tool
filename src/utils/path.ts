/* SPDX-License-Identifier: LGPL-3.0-or-later
 * ============================================================================
 *  MC Tool - Minecraft Bedrock addon development tool
 *  Copyright (C) 2024-2026 jeanmajid and contributors
 *  https://github.com/jeanmajid/MCPE-Tool
 * ============================================================================
 *
 * This file is part of MC Tool.
 *
 * MC Tool is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MC Tool is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with MC Tool. If not, see <https://www.gnu.org/licenses/>.
 */

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
