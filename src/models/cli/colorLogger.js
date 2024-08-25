const { Color } = require("./color");

/**
 * A utility class for logging messages with different colors.
 */
class ColorLogger {
    /**
     * The last logged message.
     * @type {string|null}
     */
    static lastMessage = null;

    /**
     * The number of times the last message has been repeated.
     * @type {number}
     */
    static repeatCount = 0;

    /**
     * Logs a message with the specified color.
     * If the message is the same as the last logged message, it will be repeated with an incrementing count.
     * @param {string} message - The message to log.
     * @param {Function} color - The color function to apply to the message.
     */
    static logMessage(message, color) {
        if (this.lastMessage === message) {
            this.repeatCount++;
            console.log(color(`${message} ♻️ x${this.repeatCount + 1}`));
        } else {
            this.lastMessage = message;
            this.repeatCount = 0;
            console.log(color(message));
        }
    }

    /**
     * Logs a success message with the specified color.
     * @param {string} message - The success message to log.
     */
    static success(message) {
        this.logMessage(message, Color.green);
    }

    /**
     * Logs an error message with the specified color.
     * @param {string} message - The error message to log.
     */
    static error(message) {
        this.logMessage(message, Color.red);
    }

    /**
     * Logs an info message with the specified color.
     * @param {string} message - The info message to log.
     */
    static info(message) {
        this.logMessage(message, Color.blue);
    }

    /**
     * Logs a delete message with the specified color.
     * @param {string} message - The delete message to log.
     */
    static delete(message) {
        this.logMessage(message, Color.magenta);
    }
}

module.exports = {
    ColorLogger
};
