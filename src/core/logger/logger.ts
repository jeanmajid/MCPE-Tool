import { Color } from "./color.js";

/**
 * A utility class for logging messages with different colors.
 */
export class Logger {
    /**
     * The last logged message.
     */
    public static lastMessage: string | null = null;

    /**
     * The number of times the last message has been repeated.
     */
    public static repeatCount: number = 0;

    /**
     * Logs a message with the specified color.
     * If the message is the same as the last logged message, it will be repeated with an incrementing count.
     * @param message - The message to log.
     * @param color - The color function to apply to the message.
     */
    public static logMessage(message: string, color: (text: string) => string): void {
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
     * @param message - The success message to log.
     */
    public static success(message: string): void {
        this.logMessage(message, Color.green);
    }

    /**
     * Logs an error message with the specified color.
     * @param message - The error message to log.
     */
    public static error(message: string): void {
        this.logMessage(message, Color.red);
    }

    /**
     * Logs an info message with the specified color.
     * @param message - The info message to log.
     */
    public static info(message: string): void {
        this.logMessage(message, Color.blue);
    }

    /**
     * Logs a delete message with the specified color.
     * @param message - The delete message to log.
     */
    public static delete(message: string): void {
        this.logMessage(message, Color.magenta);
    }

    /**
     * Logs a warning message with the specified color.
     * @param message - The warning message to log.
     */
    public static moduleLog(message: string): void {
        this.logMessage(message, Color.cyan);
    }
}
