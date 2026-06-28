import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PROJECT_PATH } from "./paths.js";

export const PROJECT_VERSION = JSON.parse(
    readFileSync(join(PROJECT_PATH, "/package.json"), { encoding: "utf-8" })
).version;
