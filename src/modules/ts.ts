import { ChildProcess, exec } from "child_process";
import { writeFileSync, rmSync } from "fs";
import { Logger } from "../core/logger/logger.js";
import { ModuleManager } from "../core/modules/moduleManager.js";
import { pathHasExtension } from "../utils/path.js";
import { BaseModule } from "../core/modules/baseModule.js";

class tsModule extends BaseModule {
    name: string = "ts";
    description: string = "Enable the typescript transpiler";
    cancelFileTransfer: boolean = true;
    watchProcess: ChildProcess | undefined;

    activator(filePath: string): boolean {
        return pathHasExtension(filePath, "ts");
    }

    onLaunch(bpPath?: string): Promise<void> | void {
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
        writeFileSync("./tsconfig.json", JSON.stringify(tsConfig, null, 2));

        this.watchProcess = exec("tsc --watch");

        this.watchProcess.stdout?.on("data", (data) => {
            Logger.moduleLog(data);
        });
        this.watchProcess.stderr?.on("data", (data) => {
            Logger.error(data);
        });
    }

    onExit(): Promise<void> | void {
        if (this.watchProcess) this.watchProcess.kill();
        rmSync("./tsconfig.json");
    }
}

ModuleManager.registerModule(new tsModule());
