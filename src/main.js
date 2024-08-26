#!/usr/bin/env node
const { Command } = require("./models/cli/command");
const program = new Command();
module.exports.program = program;

require("./modules/ts");
require("./modules/npm");

require("./commands/init");
require("./commands/watch");
require("./commands/modules");

program.parse(process.argv);
