/**
 * Provides color functions for console output.
 */
export class Color {
    public static black(message: string): string {
        return `\x1b[30m${message}\x1b[0m`;
    }

    public static red(message: string): string {
        return `\x1b[31m${message}\x1b[0m`;
    }

    public static green(message: string): string {
        return `\x1b[32m${message}\x1b[0m`;
    }

    public static yellow(message: string): string {
        return `\x1b[33m${message}\x1b[0m`;
    }

    public static blue(message: string): string {
        return `\x1b[34m${message}\x1b[0m`;
    }

    public static magenta(message: string): string {
        return `\x1b[35m${message}\x1b[0m`;
    }

    public static cyan(message: string): string {
        return `\x1b[36m${message}\x1b[0m`;
    }

    public static white(message: string): string {
        return `\x1b[37m${message}\x1b[0m`;
    }
}
