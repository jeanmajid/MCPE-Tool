# TODO

This is the projects todo list and shows which features are currently being worked on. Open an [issue](https://github.com/jeanmajid/MCPE-Tool/issues) to suggest your own changes.

### Core Features
- Precoded paths for the commands and modules

### Configuration
- Rename to `mc.config` or `mcconfig.json` or support any name
- Sync manifest data with config on watch
- Add a global config for things like eslint and tsconfig
- Per module configs

### Development Tools
- Add MCPE creator LSP basically / maybe even AI stuff in the future
- Package manager for custom packs

### Modules
- Make "external modules" - user defined ones with their own process for easier management. Their cwd could be in the target folder
- WSS module support custom actions, based on a file and custom key combinations.

### Module Ideas
- Import module - Make `index.js` have a custom format allowing for globs: `import("./commands/**")`
- Preprocessor macros - Extension for MC tool with `#define` support
- TypeScript rewrite - First output raw TS in temp folder, then convert. Move tsconfig outside and do transformations first
- Robust npm - Check version each time
