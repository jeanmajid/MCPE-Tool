/**@import { Config } from "./configType" */
const fs = require("fs");

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
