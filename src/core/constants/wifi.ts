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

import { networkInterfaces } from "os";

function hasInternetConnection(): boolean {
    const interfaces = networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        const netInterface = interfaces[name];
        if (!netInterface) {
            continue;
        }

        const hasActiveConnection = netInterface.some(
            (addr) =>
                (addr.family === "IPv4" || addr.family === "IPv6") &&
                !addr.internal &&
                addr.address !== "127.0.0.1" &&
                addr.address !== "::1"
        );

        if (hasActiveConnection) {
            return true;
        }
    }

    return false;
}

export const HAS_INTERNET = hasInternetConnection();
