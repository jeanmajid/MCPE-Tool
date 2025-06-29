# MCPE-Tool

A powerful command-line tool designed to streamline the development process for Minecraft Bedrock Edition add-ons. MCPE-Tool provides project initialization, real-time file watching, module management, building capabilities, and various development utilities to enhance your Minecraft add-on development workflow.

## Features

- 🚀 **Quick Project Initialization** - Set up new Minecraft add-on projects with interactive prompts
- 👀 **Real-time File Watching** - Automatically sync changes to Minecraft development folders with almost no delay
- 🔧 **Module System** - Extensible architecture with built-in modules for TypeScript, npm management
- 📦 **Build System** - Create `.mcpack` and `.mcaddon` files for distribution
- 🌐 **Translation Support** - Automatic translation of language files to multiple languages
- 🔌 **WebSocket Server** - A customisable WSS connection, to control your world with keyboard shortcuts
- ⚙️ **ESLint Integration** - Automated code quality and formatting

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) with Build tool installed (LTS version recommended)
- TypeScript (automatically installed if missing)

### Quick Install (Windows)

1. Clone or download the repository
2. Run the installation script:
```batch
install.bat
```

### Manual Install

```bash
# Clone the repository
git clone https://github.com/jeanmajid/MCPE-Tool
cd MCPE-Tool

# Install dependencies
npm install

# Build the project
npm run build

# Link globally
npm link
```

## Quick Start

### Initialize a New Project

```bash
mc init
```

This will guide you through creating a new Minecraft add-on project with:
- Behavior Pack and/or Resource Pack setup
- Manifest file generation
- Basic project structure
- Optional ESLint configuration

### Start Development

```bash
mc watch
```

This starts the file watcher that automatically syncs your changes to Minecraft's development folders.

### Build for Distribution

```bash
mc build
```

Creates `.mcpack` and `.mcaddon` files in the `dist/` folder for sharing or publishing.

## Commands

| Command | Description |
|---------|-------------|
| `mc init` | Initialize a new project with interactive setup |
| `mc watch` | Start file watcher for automatic syncing |
| `mc build` | Build distributable `.mcpack`/`.mcaddon` files |
| `mc module add <name>` | Add a module to your project |
| `mc module remove <name>` | Remove a module from your project |
| `mc module list` | List all available modules |
| `mc translate` | Translate language files to multiple languages |
| `mc wss` | Start WebSocket server |
| `mc repair` | Fix and update project configuration |
| `mc help` | Show available commands |

## Modules

MCPE-Tool uses a modular architecture to extend functionality:

- **npm** - Automatically manages npm packages and dependencies
- **ts** - TypeScript transpilation with live compilation

## Project Structure

```
your-project/
├── config.json          # Project configuration
├── BP/                   # Behavior Pack
│   ├── manifest.json
│   └── scripts/
├── RP/                   # Resource Pack (optional)
│   ├── manifest.json
│   └── texts/
└── dist/                 # Built packages
```

## Configuration

Projects are configured via `config.json`:

```json
{
    "name": "MyAddon",
    "description": "My awesome Minecraft add-on",
    "modules": ["npm", "ts"],
    "id": "unique-project-id",
    "behaviourPackPath?": "./BP",
    "resourcePackPath?": "./RP",
    "output?": "stable | preview"
}
```

### Configuration Options

- `name` - Project name (used for output folders)
- `description` - Project description
- `modules` - Array of enabled modules
- `id` - Unique project identifier
- `behaviourPackPath` - Path to behavior pack folder
- `resourcePackPath` - Path to resource pack folder
- `output` - Target Minecraft version (`"stable"` or `"preview"`)
- `remote` - Remote deployment configuration (Will probably be removed in future)

## Translation Support

Automatically translate your add-on to multiple languages:

1. Create `RP/texts/en_US.lang` with your base language
2. Run `mc translate`
3. Translated files will be generated for all supported languages

**Note:** The translation feature currently utilizes the Argos translation library and probably do not provide production-quality translations. For professional or commercial projects, manual review and refinement of translated content is recommended.

## Development

### Building from Source

```bash
npm run build        # Build TypeScript
npm run dev          # Watch mode for development
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Creating Custom Modules

Extend MCPE-Tool with custom modules by implementing the [`BaseModule`](src/core/modules/baseModule.ts) interface:

```typescript
import { BaseModule, ModuleManager } from "mcpe-tool";

class MyModule extends BaseModule {
    name = "my-module";
    description = "My custom module";
    
    activator(filePath: string): boolean {
        return filePath.endsWith('.myext');
    }
    
    handleFile(filePath: string) {
        // Process file
        return { newFilePath: filePath, fileData: "processed content" };
    }
}

ModuleManager.registerModule(new MyModule());
```

**Note:** Modules local thingy text TODO

## WebSocket Debug Server

Start a WebSocket server for real-time debugging:

```bash
mc wss
```

- Automatically copies `/wsserver localhost:8080` to clipboard
- Use hotkeys (P, O, I) to send gamemode commands

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for the Minecraft Bedrock Edition add-on development community
- Uses [Chokidar](https://github.com/paulmillr/chokidar) for file watching
- Translation powered by [Argos Translate](https://github.com/argosopentech/argos-translate)

## TODO

This is the projects todo list and shows which features are currently being worked on. Open an [issue](https://github.com/jeanmajid/MCPE-Tool/issues) to suggest your own changes.

### Core Features
- Make cleanup always run
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

#### Module Ideas
- Import module - Make `index.js` have a custom format allowing for globs: `import("./commands/**")`
- Preprocessor macros - Extension for MC tool with `#define` support
- TypeScript rewrite - First output raw TS in temp folder, then convert. Move tsconfig outside and do transformations first
- Robust npm - Check version each time
