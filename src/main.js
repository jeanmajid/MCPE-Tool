#!/usr/bin/env node
const { Command } = require("./models/cli/command");
const program = new Command();
module.exports.program = program

require("./commands/init");
require("./commands/watch");

program.parse(process.argv);
