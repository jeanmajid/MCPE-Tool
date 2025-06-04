/**
 * Provides color functions for console output.
 */
export class Color {
    static black(message: string): string {
        return `\x1b[30m${message}\x1b[0m`;
    }

    static red(message: string): string {
        return `\x1b[31m${message}\x1b[0m`;
    }

    static green(message: string): string {
        return `\x1b[32m${message}\x1b[0m`;
    }

    static yellow(message: string): string {
        return `\x1b[33m${message}\x1b[0m`;
    }

    static blue(message: string): string {
        return `\x1b[34m${message}\x1b[0m`;
    }

    static magenta(message: string): string {
        return `\x1b[35m${message}\x1b[0m`;
    }

    static cyan(message: string): string {
        return `\x1b[36m${message}\x1b[0m`;
    }

    static white(message: string): string {
        return `\x1b[37m${message}\x1b[0m`;
    }
}
