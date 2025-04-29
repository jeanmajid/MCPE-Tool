#!/usr/bin/env node

import { PROJECT_PATH_SRC } from "./constants/paths.js";
import { Command } from "./models/cli/command.js";
import { existsSync, readdirSync } from "fs";

import path from "path";
import { pathToFileURL } from "url";

async function loadDir(dir) {
    if (!existsSync(dir)) {
        return;
    }
    const jsFiles = readdirSync(dir).filter((f) => f.endsWith(".js"));
    await Promise.all(
        jsFiles.map((fileName) => {
            const fullPath = path.join(dir, fileName);
            return import(pathToFileURL(fullPath).href);
        })
    );
}

await Promise.all([
    loadDir(path.join(PROJECT_PATH_SRC, "modules")),
    loadDir(path.join(PROJECT_PATH_SRC, "commands")),
    loadDir("./plugins"),
]);

Command.parse(process.argv);
