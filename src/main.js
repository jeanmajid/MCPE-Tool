#!/usr/bin/env node

import { Command } from "./models/cli/command.js";

// Modules
import "./modules/ts.js";
import "./modules/npm.js";

// Commands
import "./commands/repair.js";
import "./commands/init.js";
import "./commands/module.js";
import "./commands/watch.js";
import "./commands/build.js";
import "./commands/translate.js";
import "./commands/make.js";
import "./commands/fix.js";
import "./commands/wss.js";
import "./commands/get.js";

Command.parse(process.argv);