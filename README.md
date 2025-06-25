# MCPE-Tool

A command-line tool designed to streamline the development process for Minecraft Bedrock Edition add-ons. It helps with project initialization, file management, building, and various common development tasks.

TODO:

- Dynamic npm module install, instead of having them preinstalled - dynamicImport("package");
- Make cleanup always run
- Precoded paths for the commands
- config
-- rename to mc.config or mcconfig.json or support any name
-- sync manifest data with config on watch
-- add an global config
-- Per module configs
- add mcpe creator lsp basically / maybe even ai stuff
- package manager, for custom packs also add a regolith filter that then supports it
- module
-- make "external modules", basically user defined ones, that have their own process, so its easier to manage. Their cwd could be in the target folder
- module ideas
-- Import module, make index.js have a custom format allowing for globs - import("./commands/**")
-- make default: install npm modules outside of the bp folder, so that eslint works. Add config option to install it in the bp folder
-- Make preprocessor macros extension for mc tool / # define
-- Rewrite ts extension to first spit out raw ts in an temp folder and then convert that, also mean we can move tsconfig outside and do transformations on the code first
-- Make npm more robust and check the version each time
- Init
-- automatic eslint setup