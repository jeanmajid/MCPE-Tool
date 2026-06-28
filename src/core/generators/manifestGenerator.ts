/* SPDX-License-Identifier: GPL-3.0-or-later
 * ============================================================================
 * MC Tool
 * Copyright (C) 2024-2026 jeanmajid and contributors
 * https://github.com/jeanmajid/MCPE-Tool
 * ============================================================================
 *
 * This file is part of MC Tool.
 *
 * MC Tool is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MC Tool is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with MC Tool. If not, see <https://www.gnu.org/licenses/>.
 */

import { generateUUIDv4 } from "../../utils/id.js";

interface ManifestModule {
    type: string;
    uuid: string;
    version: [number, number, number];
    language?: string;
    entry?: string;
}

interface ManifestMetadata {
    authors: string[];
}

interface ManifestDependency {
    module_name?: string;
    uuid?: string;
    version: string;
}

interface Manifest {
    format_version: number;
    header: {
        name: string;
        description: string;
        uuid: string;
        version: [number, number, number];
        min_engine_version: [number, number, number];
    };
    modules?: ManifestModule[];
    metadata?: ManifestMetadata;
    dependencies?: ManifestDependency[];
}

/**
 * Class representing a Manifest Generator.
 */
export class ManifestGenerator {
    public mainUUID: string = generateUUIDv4();
    public manifest: Manifest;

    /**
     * Create a Manifest Generator.
     * @param name - The name of the manifest.
     * @param description - The description of the manifest.
     */
    public constructor(name: string, description: string = "") {
        this.manifest = {
            format_version: 2,
            header: {
                name: name,
                description: description,
                uuid: this.mainUUID,
                version: [1, 0, 0],
                min_engine_version: [1, 21, 70],
            },
        };
    }

    /**
     * Add a module to the manifest.
     * @param type - The type of the module.
     * @param language - The language of the module.
     * @param entry - The entry point of the module.
     */
    public addModule(
        type: string,
        language: string | null = null,
        entry: string | null = null
    ): void {
        if (!this.manifest.modules) {
            this.manifest.modules = [];
        }

        const module: ManifestModule = { type: type, uuid: generateUUIDv4(), version: [1, 0, 0] };

        if (language) {
            module.language = language;
        }
        if (entry) {
            module.entry = entry;
        }

        this.manifest.modules.push(module);
    }

    /**
     * Add an author to the manifest.
     * @param author - The author to add.
     */
    public addAuthor(author: string): void {
        if (!this.manifest.metadata) {
            this.manifest.metadata = { authors: [] };
        }

        this.manifest.metadata.authors.push(author);
    }

    /**
     * Add a dependency to the manifest.
     * @param module_name - The name of the module to depend on.
     * @param version - The version of the module to depend on.
     */
    public addDependency(module_name: string, version: string): void {
        if (!this.manifest.dependencies) {
            this.manifest.dependencies = [];
        }
        this.manifest.dependencies.push({ module_name, version });
    }

    /**
     * Add a dependency to the manifest using a UUID.
     * @param uuid - The UUID of the module to depend on.
     * @param version - The version of the module to depend on.
     */
    public addDependencyUUID(uuid: string, version: string): void {
        if (!this.manifest.dependencies) {
            this.manifest.dependencies = [];
        }
        this.manifest.dependencies.push({ uuid, version });
    }

    /**
     * Generate the manifest object.
     * @returns The generated manifest object.
     */
    public generate(): Manifest {
        return this.manifest;
    }

    /**
     * Generate the manifest object as a string.
     * @returns The generated manifest object as a string.
     */
    public generateString(): string {
        return JSON.stringify(this.manifest, null, 4);
    }
}
