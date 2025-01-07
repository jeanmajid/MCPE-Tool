const { ModuleManager } = require("../models/files/moduleManager");
const fs = require("fs");
const ts = require("typescript");
const { ColorLogger } = require("../models/cli/colorLogger");

const compilerOptions = {
    module: "ESNext",
    target: "ESNext",
    moduleResolution: "Node",
    allowSyntheticDefaultImports: true,
    preserveConstEnums: true,
    removeComments: true,
    isolatedModules: false,
};

ModuleManager.addModule({
    name: "ts",
    description: "Enable the typescript transpiler",
    cancelFileTransfer: true,
    activatorHandlerPairs: [
        {
            activator: (filePath) => !filePath.endsWith(".d.ts") && filePath.endsWith(".ts"),
            handleFile: (filePath) => {
                const tsCode = fs.readFileSync(filePath, "utf8");
                const result = ts.transpileModule(tsCode, { compilerOptions });
                ColorLogger.moduleLog(`Transpiled: ${filePath}`);
                return { newFilePath: filePath.replace(/\.ts$/, ".js"), fileData: result.outputText };
            },
        },
        {
            activator: (filePath) => filePath.endsWith(".d.ts"),
        },
    ],
});
