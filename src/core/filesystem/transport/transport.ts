/* SPDX-License-Identifier: GPL-3.0-or-later
 * ============================================================================
 * MC Tool
 * Copyright (C) 2024-2026 jeanmajid and contributors
 * https://github.com/jeanmajid/MCPE-Tool
 * ============================================================================
 *
 * This file is part of MC Tool.
 *
 * MC Tool is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MC Tool is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with MC Tool. If not, see <https://www.gnu.org/licenses/>.
 */

export abstract class Transport {
    public abstract ensureDir(dir: string): Promise<void>;
    public abstract writeFile(destPath: string, contents: string): Promise<void>;
    public abstract copyFile(srcPath: string, destPath: string): Promise<void>;
    public abstract deleteFile(destPath: string): Promise<void>;
}
