const { ModuleManager } = require("../models/files/moduleManager");
const { exec } = require("child_process");
const { ColorLogger } = require("../models/cli/colorLogger");
const { writeFileSync, rmSync, existsSync } = require("fs");

ModuleManager.addModule({
    name: "ts",
    description: "Enable the typescript transpiler",
    cancelFileTransfer: true,
    activator: (filePath) => filePath.endsWith(".ts"),
    onLaunch: (bpPath) => {
        const tsConfig = {
            "compilerOptions": {
                "module": "ESNext",
                "target": "ESNext",
                "moduleResolution": "Node",
                "allowSyntheticDefaultImports": true,
                "removeComments": true,
                "outDir": `${bpPath}/scripts`
            },
            "include": ["BP/scripts/**/*.ts"]
        };
        writeFileSync("./tsconfig.json", JSON.stringify(tsConfig, null, 2));

        const watchProcess = exec("tsc --watch");

        watchProcess.stdout.on('data', (data) => {
            ColorLogger.moduleLog(data);
        });
        watchProcess.stderr.on('data', (data) => {
            ColorLogger.error(data);
        });
    },
    onExit: () => {
        rmSync("./tsconfig.json");
    }
});