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

import { ChildProcess, exec } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

import { BEHAVIOUR_PACK_PATH } from "../core/constants/paths.js";
import { Logger } from "../core/logger/logger.js";
import { BaseModule } from "../core/modules/baseModule.js";
import { ModuleManager } from "../core/modules/moduleManager.js";
import { pathHasExtension } from "../utils/path.js";

class TsModule extends BaseModule {
    public name: string = "ts";
    public description: string = "Enable the typescript transpiler";
    public cancelFileTransfer: boolean = true;
    public watchProcess: ChildProcess | undefined;

    public activator(filePath: string): boolean {
        return pathHasExtension(filePath, "ts");
    }

    public onLaunch(bpPath?: string): Promise<void> | void {
        if (!bpPath) {
            Logger.error("Output folder for behavior pack not found");
            process.exit(1);
        }

        exec("npm exec --no -- tsc --version", (error) => {
            if (error) {
                Logger.error(
                    "TypeScript compiler not found. Please install TypeScript globally: npm install -g typescript"
                );
                process.exit(1);
            }
        });

        const outDir = join(bpPath, "scripts");
        const tsConfig = {
            compilerOptions: {
                target: "esnext",
                module: "esnext",
                moduleResolution: "bundler",
                allowSyntheticDefaultImports: true,
                removeComments: true,
                outDir: "dist",
                noEmit: true,
                rootDir: join(relative(".", BEHAVIOUR_PACK_PATH), "scripts"),
            },
            include: [join(relative(".", BEHAVIOUR_PACK_PATH), "scripts") + "/**/*.ts"],
        };

        if (!existsSync("./tsconfig.json")) {
            writeFileSync("./tsconfig.json", JSON.stringify(tsConfig, null, 4));
        }

        this.watchProcess = exec(
            `npm exec --no -- tsc --watch --noEmit false --outDir "${outDir}"`
        );

        this.watchProcess.stdout?.on("data", (data) => {
            Logger.moduleLog(data);
        });
        this.watchProcess.stderr?.on("data", (data) => {
            Logger.error(data);
        });
    }

    public onExit(): Promise<void> | void {
        if (this.watchProcess) {
            this.watchProcess.kill();
        }
    }
}

ModuleManager.registerModule(new TsModule());
