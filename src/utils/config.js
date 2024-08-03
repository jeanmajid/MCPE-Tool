const fs = require("fs-extra");

/**
 * Reads the configuration from the "config.json" file.
 * If the file doesn't exist or is empty, an empty object is returned.
 * @returns {Object} The configuration object parsed from the "config.json" file.
 */
function readConfig() {
    if (!fs.existsSync("./config.json")) {
        return {};
    }
    return JSON.parse(fs.readFileSync("./config.json", "utf-8") || "{}");
}

module.exports = {
    readConfig
};
