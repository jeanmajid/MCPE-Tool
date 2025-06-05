#!/usr/bin/env node

import { Command } from "./core/cli/command.js";

Command.parse(process.argv);
