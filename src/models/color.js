class Color {
    static green(message) {
        return `\x1b[32m${message}\x1b[0m`;
    }

    static red(message) {
        return `\x1b[31m${message}\x1b[0m`;
    }

    static blue(message) {
        return `\x1b[34m${message}\x1b[0m`;
    }

    static magenta(message) {
        return `\x1b[35m${message}\x1b[0m`;
    }
}

module.exports = { Color };
