# MCPE-Tool
A command-line tool designed to streamline the development process for Minecraft Bedrock Edition add-ons. It helps with project initialization, file management, building, and various common development tasks.

## TODO

### Core Features
- Make cleanup always run
- Precoded paths for the commands

### Configuration
- Rename to `mc.config` or `mcconfig.json` or support any name
- Sync manifest data with config on watch
- Add a global config
- Per module configs

### Development Tools
- Add MCPE creator LSP basically / maybe even AI stuff
- Package manager for custom packs, also add a Regolith filter that supports it

### Modules
- Make "external modules" - user defined ones with their own process for easier management. Their cwd could be in the target folder

#### Module Ideas
- **Import module - Make `index.js` have a custom format allowing for globs: `import("./commands/**")`
- Default setup - Install npm modules outside of the bp folder so ESLint works. Add config option to install in bp folder
- Preprocessor macros - Extension for MC tool with `#define` support
- TypeScript rewrite - First output raw TS in temp folder, then convert. Move tsconfig outside and do transformations first
- Robust npm - Check version each time

### Initialization
- Automatic ESLint setup