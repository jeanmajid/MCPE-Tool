import { ChildProcess, exec } from "child_process";
import { writeFileSync, rmSync } from "fs";

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
        exec("tsc --version", error => {
            if (error) {
                Logger.error(
                    "TypeScript compiler not found. Please install TypeScript globally: npm install -g typescript"
                );
                process.exit(1);
            }
        });

        const tsConfig = {
            compilerOptions: {
                module: "ESNext",
                target: "ESNext",
                moduleResolution: "Node",
                allowSyntheticDefaultImports: true,
                removeComments: true,
                outDir: `${bpPath}/scripts`,
            },
            include: ["BP/scripts/**/*.ts"],
        };

        writeFileSync("./tsconfig.json", JSON.stringify(tsConfig, null, 4));

        this.watchProcess = exec("tsc --watch");

        this.watchProcess.stdout?.on("data", data => {
            Logger.moduleLog(data);
        });
        this.watchProcess.stderr?.on("data", data => {
            Logger.error(data);
        });
    }

    public onExit(): Promise<void> | void {
        rmSync("./tsconfig.json");
        if (this.watchProcess) {
            this.watchProcess.kill();
        }
    }
}

ModuleManager.registerModule(new TsModule());
