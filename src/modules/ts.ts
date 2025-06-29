import { ChildProcess, exec } from "child_process";
import { writeFileSync, rmSync, existsSync } from "fs";
import { Logger } from "../core/logger/logger.js";
import { ModuleManager } from "../core/modules/moduleManager.js";
import { pathHasExtension } from "../utils/path.js";
import { BaseModule } from "../core/modules/baseModule.js";

class TsModule extends BaseModule {
    name: string = "ts";
    description: string = "Enable the typescript transpiler";
    cancelFileTransfer: boolean = true;
    watchProcess: ChildProcess | undefined;

    activator(filePath: string): boolean {
        return pathHasExtension(filePath, "ts");
    }

    onLaunch(bpPath?: string): Promise<void> | void {
        exec("tsc --version", (error) => {
            if (error) {
                Logger.error(
                    "TypeScript compiler not found. Please install TypeScript globally: npm install -g typescript"
                );
                process.exit(1);
            }
        });

        if (!existsSync("./tsconfig.json")) {
            const tsConfig = {
                compilerOptions: {
                    module: "ESNext",
                    target: "ESNext",
                    moduleResolution: "Node",
                    allowSyntheticDefaultImports: true,
                    removeComments: true,
                    outDir: `${bpPath}/scripts`
                },
                include: ["BP/scripts/**/*.ts"]
            };

            writeFileSync("./tsconfig.json", JSON.stringify(tsConfig, null, 4));
        }

        this.watchProcess = exec("tsc --watch");

        this.watchProcess.stdout?.on("data", (data) => {
            Logger.moduleLog(data);
        });
        this.watchProcess.stderr?.on("data", (data) => {
            Logger.error(data);
        });
    }

    onExit(): Promise<void> | void {
        if (this.watchProcess) {
            this.watchProcess.kill();
        }
    }
}

ModuleManager.registerModule(new TsModule());
