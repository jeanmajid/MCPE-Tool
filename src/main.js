#!/usr/bin/env node
import { Command } from "./models/cli/command.js";
export const program = new Command();

import "./commands/init.js";
import "./commands/watch.js";

program.parse(process.argv);
