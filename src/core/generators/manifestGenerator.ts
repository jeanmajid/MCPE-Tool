import { v4 as uuidv4 } from "uuid";

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
    mainUUID: string = uuidv4();
    manifest: Manifest;

    /**
     * Create a Manifest Generator.
     * @param name - The name of the manifest.
     * @param description - The description of the manifest.
     */
    constructor(name: string, description: string = "") {
        this.manifest = {
            format_version: 2,
            header: {
                name: name,
                description: description,
                uuid: this.mainUUID,
                version: [1, 0, 0],
                min_engine_version: [1, 21, 70]
            }
        };
    }

    /**
     * Add a module to the manifest.
     * @param type - The type of the module.
     * @param language - The language of the module.
     * @param entry - The entry point of the module.
     */
    addModule(type: string, language: string | null = null, entry: string | null = null): void {
        if (!this.manifest.modules) {
            this.manifest.modules = [];
        }

        const module: ManifestModule = {
            type: type,
            uuid: uuidv4(),
            version: [1, 0, 0]
        };

        if (language) module.language = language;
        if (entry) module.entry = entry;

        this.manifest.modules.push(module);
    }

    /**
     * Add an author to the manifest.
     * @param author - The author to add.
     */
    addAuthor(author: string): void {
        if (!this.manifest.metadata) {
            this.manifest.metadata = {
                authors: []
            };
        }

        this.manifest.metadata.authors.push(author);
    }

    /**
     * Add a dependency to the manifest.
     * @param module_name - The name of the module to depend on.
     * @param version - The version of the module to depend on.
     */
    addDependency(module_name: string, version: string): void {
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
    addDependencyUUID(uuid: string, version: string): void {
        if (!this.manifest.dependencies) {
            this.manifest.dependencies = [];
        }
        this.manifest.dependencies.push({ uuid, version });
    }

    /**
     * Generate the manifest object.
     * @returns The generated manifest object.
     */
    generate(): Manifest {
        return this.manifest;
    }

    /**
     * Generate the manifest object as a string.
     * @returns The generated manifest object as a string.
     */
    generateString(): string {
        return JSON.stringify(this.manifest, null, 4);
    }
}
