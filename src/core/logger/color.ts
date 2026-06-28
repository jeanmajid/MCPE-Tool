/* SPDX-License-Identifier: LGPL-3.0-or-later
 * ============================================================================
 *  MC Tool - Minecraft Bedrock addon development tool
 *  Copyright (C) 2025-2026 jeanmajid and contributors
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
 * Provides color functions for console output.
 */
export class Color {
    public static black(message: string): string {
        return `\x1b[30m${message}\x1b[0m`;
    }

    public static red(message: string): string {
        return `\x1b[31m${message}\x1b[0m`;
    }

    public static green(message: string): string {
        return `\x1b[32m${message}\x1b[0m`;
    }

    public static yellow(message: string): string {
        return `\x1b[33m${message}\x1b[0m`;
    }

    public static blue(message: string): string {
        return `\x1b[34m${message}\x1b[0m`;
    }

    public static magenta(message: string): string {
        return `\x1b[35m${message}\x1b[0m`;
    }

    public static cyan(message: string): string {
        return `\x1b[36m${message}\x1b[0m`;
    }

    public static white(message: string): string {
        return `\x1b[37m${message}\x1b[0m`;
    }
}
