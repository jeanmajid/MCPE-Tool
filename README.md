# MCPE-Tool

A powerful command-line tool designed to streamline the development process for Minecraft Bedrock Edition add-ons. MCPE-Tool provides project initialization, real-time file watching, module management, building capabilities, and various development utilities to enhance your Minecraft add-on development workflow.

Join the [Discord](https://discord.gg/6PFMrzS3sG) for support or watch this [video](https://www.youtube.com/watch?v=KIWSvrCObmg)

If you find this project helpful, please consider giving it a star on GitHub

## Features

- **Quick Project Initialization** - Set up new Minecraft add-on projects with interactive prompts
- **Real-time File Watching** - Automatically sync changes to Minecraft development folders with almost no delay
- **Module System** - Extensible architecture with built-in modules for TypeScript, npm management
- **Build System** - Create `.mcpack` and `.mcaddon` files for distribution

## Installation

## NPM

Just run this command
```batch
npm i -g @jeanmajid/mcpe-tool
```

## Manuall Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- TypeScript (automatically installed if missing)

### Quick Install (Windows)

1. Clone or download the repository
2. Run the installation script:
```batch
install.bat
```

### Non Quick Install

```bash
# Clone the repository
git clone https://github.com/jeanmajid/MCPE-Tool
cd MCPE-Tool

# Install dependencies
npm install

# Build the project
npm run build

# Generate the schema
npm run schema

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
| `mc update` | Updates the tool to the newest version |
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
│   └── ...
├── RP/                   # Resource Pack
│   ├── manifest.json
│   └── ...
└── dist/                 # Build packages
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

**Note:** The translation feature currently utilizes the Argos translation library and most definitely does not provide production-quality translations. For professional or commercial projects, manual review and refinement of translated content is recommended.

## Development

### Building from Source

```bash
npm run build        # Build TypeScript
npm run dev          # Watch mode for development
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Creating Custom Modules

Extend MCPE-Tool with custom modules by extending the [`BaseModule`](src/core/modules/baseModule.ts) class:

```typescript
import { ModuleManager } from "../core/modules/moduleManager.js";
import { BaseModule, FileHandlerResult } from "../core/modules/baseModule.js";
import { Logger } from "../core/logger/logger.js";

class SampleModule extends BaseModule {
    name: string = "samplePlugin";
    description: string = "Sample plugin to redact all files that include the word .hide.";
    cancelFileTransfer: boolean = true;

    onLaunch(bpPath?: string, rpPath?: string): Promise<void> | void {
        Logger.moduleLog("[SamplePlugin] Started!");
    }

    onExit(): Promise<void> | void {
        Logger.moduleLog("[SamplePlugin] Stopped!");
    }

    activator(filePath: string): boolean {
        return filePath.includes(".hide.");
    }

    handleFile(filePath: string): FileHandlerResult {
        return {
            fileData: "this file was redacted",
            newFilePath: filePath.replace(".hide.", ".")
        };
    }
}

ModuleManager.registerModule(new SampleModule());

```

**Note:** To register custom modules, create a customModules folder in src (src/customModules) and write your module in there.

### Creating Custom Commands

Extend MCPE-Tool with custom commands:

```typescript
import { Command } from "../core/cli/command.js";
import { Logger } from "../core/logger/logger.js";

Command.command("test")
    .description("testCommand")
    .action(async (args, flags) => {
        Logger.info("Ran your test command");
    });

Command.subCommand("sub")
    .description("This is a sub command")
    .action(async (args, flags) => {
        Logger.info("Ran your test sub command");
    });

```

**Note:** To register custom commands, create a customCommands folder in src (src/customCommands) and write your custom command code in there.

**Important** To make your command work, the file name needs to be the same as the command name.

## WebSocket Debug Server

Start a WebSocket server for real-time debugging:

```bash
mc wss
```

- Automatically copies `/wsserver localhost:8080` to clipboard
- Use hotkeys ctrl + (P, O, I) to send gamemode commands

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
