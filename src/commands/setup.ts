/* SPDX-License-Identifier: LGPL-3.0-or-later
 * ============================================================================
 *  MC Tool - Minecraft Bedrock addon development tool
 *  Copyright (C) 2024-2026 jeanmajid and contributors
 *  https://github.com/jeanmajid/MCPE-Tool
 * ============================================================================
 *
 * This file is part of MC Tool.
 *
 * MC Tool is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MC Tool is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with MC Tool. If not, see <https://www.gnu.org/licenses/>.
 */

import { existsSync } from "node:fs";
import { rm, cp } from "node:fs/promises";
import { join } from "node:path";

import { Command } from "../core/cli/command.js";
import { PROJECT_PATH } from "../core/constants/paths.js";
import { Logger } from "../core/logger/logger.js";
import { installPackage, uninstallPackage } from "../utils/npm.js";

Command.command("setup").description("Setup some things like oxlint");

Command.subCommand("oxlint")
    .description(
        "Installs oxlint linter and formatter and removed legacy eslint setup. Use --pnpm for pnpm"
    )
    .action(async (args, flags) => {
        const packageManager = flags.includes("--pnpm") ? "pnpm" : "npm";

        Logger.info("Getting rid of old eslint config and packages if they exist...");

        const packagesToRemove = [
            "eslint-config-prettier",
            "eslint-plugin-prettier",
            "prettier",
            "@typescript-eslint/eslint-plugin",
            "@typescript-eslint/parser",
            "eslint",
            "acorn",
            "acorn-jsx",
            "ajv",
            "ansi-styles",
            "argparse",
            "balanced-match",
            "brace-expansion",
            "braces",
            "callsites",
            "chalk",
            "color-convert",
            "color-name",
            "concat-map",
            "cross-spawn",
            "debug",
            "deep-is",
            "escape-string-regexp",
            "eslint-scope",
            "eslint-visitor-keys",
            "espree",
            "esquery",
            "esrecurse",
            "estraverse",
            "esutils",
            "fast-deep-equal",
            "fast-diff",
            "fast-glob",
            "fast-json-stable-stringify",
            "fast-levenshtein",
            "fastq",
            "file-entry-cache",
            "fill-range",
            "find-up",
            "flat-cache",
            "flatted",
            "glob-parent",
            "globals",
            "graphemer",
            "has-flag",
            "ignore",
            "import-fresh",
            "imurmurhash",
            "is-extglob",
            "is-glob",
            "is-number",
            "isexe",
            "js-yaml",
            "json-buffer",
            "json-schema-traverse",
            "json-stable-stringify-without-jsonify",
            "keyv",
            "levn",
            "locate-path",
            "lodash.merge",
            "merge2",
            "micromatch",
            "minimatch",
            "ms",
            "natural-compare",
            "optionator",
            "p-limit",
            "p-locate",
            "parent-module",
            "path-exists",
            "path-key",
            "picomatch",
            "prelude-ls",
            "prettier-linter-helpers",
            "punycode",
            "queue-microtask",
            "resolve-from",
            "reusify",
            "run-parallel",
            "semver",
            "shebang-command",
            "shebang-regex",
            "strip-json-comments",
            "supports-color",
            "synckit",
            "to-regex-range",
            "ts-api-utils",
            "type-check",
            "typescript",
            "uri-js",
            "which",
            "word-wrap",
            "yocto-queue",
        ];

        await uninstallPackage(packagesToRemove, ".", packageManager);

        const eslintConfigPath = "./eslint.config.js";
        if (existsSync(eslintConfigPath)) {
            await rm("./eslint.config.js");
        }

        const packagesToInstall = ["oxlint", "oxfmt"];

        Logger.info("Installing oxlint and oxfmt...");

        await installPackage(packagesToInstall, ".", packageManager);

        await cp(join(PROJECT_PATH, "./.oxfmtrc.json"), "./.oxfmtrc.json");
        await cp(join(PROJECT_PATH, "./.oxlintrc.json"), "./.oxlintrc.json");
        await cp(join(PROJECT_PATH, "./.vscode"), "./.vscode", { recursive: true });

        Logger.success("Successfully installed oxlint and oxfmt and added base config");
    });
