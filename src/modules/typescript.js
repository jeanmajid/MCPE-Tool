class ExampleModule {
    /**
     * Checks if the module should activate based on the file path.
     * @param {string} filePath - The path of the file.
     * @returns {boolean} - True if the module should activate, false otherwise.
     */
    activate(filePath) {
        // Example condition: activate if the file is a JavaScript file
        return filePath.endsWith(".js");
    }

    /**
     * Handles the file and decides whether to cancel the transfer.
     * @param {string} filePath - The path of the file.
     * @returns {boolean} - True to cancel the transfer, false to proceed.
     */
    handleFile(filePath) {
        // Example logic: log the file path and do not cancel the transfer
        console.log(`ExampleModule handling file: ${filePath}`);
        return false; // Do not cancel the transfer
    }
}

module.exports = {
    ExampleModule
};
