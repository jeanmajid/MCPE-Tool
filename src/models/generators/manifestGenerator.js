const { v4: uuidv4 } = require("uuid");

/**
 * Class representing a Manifest Generator.
 */
class ManifestGenerator {
    /**
     * Create a Manifest Generator.
     * @param {string} name - The name of the manifest.
     * @param {string} [description=""] - The description of the manifest.
     */
    constructor(name, description = "") {
        /**
         * The manifest object.
         * @type {object}
         */
        this.manifest = {
            format_version: 2,
            header: {
                name: name,
                description: description,
                uuid: uuidv4(),
                version: [1, 0, 0],
                min_engine_version: [1, 20, 80],
            },
        };
    }

    /**
     * Add a module to the manifest.
     * @param {string} type - The type of the module.
     * @param {string|null} [language=null] - The language of the module.
     * @param {string|null} [entry=null] - The entry point of the module.
     */
    addModule(type, language = null, entry = null) {
        if (!this.manifest.modules) {
            this.manifest.modules = [];
        }

        const module = {
            type: type,
            uuid: uuidv4(),
            version: [1, 0, 0],
        };

        if (language) module.language = language;
        if (entry) module.entry = entry;

        this.manifest.modules.push(module);
    }

    /**
     * Add an author to the manifest.
     * @param {string} author - The author to add.
     */
    addAuthor(author) {
        if (!this.manifest.metadata) {
            this.manifest.metadata = {
                authors: [],
            };
        }

        this.manifest.metadata.authors.push(author);
    }

    /**
     * Add a dependency to the manifest.
     * @param {string} module_name - The name of the module to depend on.
     * @param {string} version - The version of the module to depend on.
     */
    addDependency(module_name, version) {
        if (!this.manifest.dependencies) {
            this.manifest.dependencies = [];
        }
        this.manifest.dependencies.push({ module_name, version });
    }

    /**
     * Generate the manifest object.
     * @returns {object} The generated manifest object.
     */
    generate() {
        return this.manifest;
    }

    /**
     * Generate the manifest object as a string.
     * @returns {string} The generated manifest object as a string.
     */
    generateString() {
        return JSON.stringify(this.manifest, null, 4);
    }
}

module.exports = {
    ManifestGenerator
};
