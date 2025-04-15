const fs = require("fs");

/**
 * The default configuration object.
 * @typedef {Object} Config
 * @property {string} name - The name of the project.
 * @property {string} description - The description of the project.
 * @property {Array} modules - The modules of the project.
 * @property {string} id - The ID of the project.
 * @property {string?} resourcePackPath - The Path to the Resource Pack
 * @property {string?} behaviourPackPath - The Path to the Behaviour Pack
 */

/**
 * Reads the configuration from the "config.json" file.
 * If the file doesn't exist or is empty, an empty object is returned.
 * @returns {Config} The configuration object parsed from the "config.json" file.
 */
function readConfig() {
    if (!fs.existsSync("./config.json")) {
        return {};
    }
    return JSON.parse(fs.readFileSync("./config.json", "utf-8") || "{}");
}

/**
 * Writes the configuration to the "config.json" file.
 * @param {Config} config - The configuration object to write.
 */
function writeConfig(config) {
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
}

module.exports = {
    readConfig,
    writeConfig
};
