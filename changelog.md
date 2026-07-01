# 1.0.1

- NPM Module:
- Now supports preview packages, to enable make sure output is set to "preview"
- Added support for @minecraft/server-graphics

# 1.0.2

- Schema now is hosted on github, so it works if multiple people work on an project (run "mc repair" to fix you schema)
- Added "awaitWriteFinish" to config, use if you experience issues with the tool transfering data too fast
- Updated output paths:
- "stable" and "preview" now point to the gdk paths
- "stable_uwp" and "preview_uwp" can be used if your still on uwp

# 1.0.3

- Mc update command now supports npm

# 1.0.4

- fix: npm module now correctly gets preview versions

# 1.0.5

- Remove automatic eslint configuration, might be added back in the future
- Project now uses oxlint and oxfmt
- PNPM module, which installs packages the same way the npm module does, but with PNPM

# 1.0.6

- Setup command to setup oxlint and remove existing eslint setup

# 1.0.7

- Fixed update command
- Manifest can now have comments and mc tool will still work fine
- Version command

# 1.0.8

- The default action and the help command now also display the output of version at the start
- Change to GPL license

# 1.0.9

- Change to LGPL license as I want to support closed source plugins

# 1.0.10

- Hotfix: fixed mc tool, it was broken
