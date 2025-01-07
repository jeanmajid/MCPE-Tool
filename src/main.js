#!/usr/bin/env node

const { Command } = require("./models/cli/command");
const program = new Command();
module.exports.program = program;

// Modules
require("./modules/ts");
require("./modules/npm");
require("./modules/backup");

// Commands
require("./commands/repair");
require("./commands/init");
require("./commands/module");
require("./commands/watch");
require("./commands/build");
require("./commands/translate");
require("./commands/make");
require("./commands/fix");
require("./commands/wss");
require("./commands/get");

program.parse(process.argv);