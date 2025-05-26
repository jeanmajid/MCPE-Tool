#!/usr/bin/env node

import { Command } from "./models/cli/command.js";

Command.parse(process.argv);
