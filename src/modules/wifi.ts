import { networkInterfaces } from "os";

function hasInternetConnection(): boolean {
    const interfaces = networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        const netInterface = interfaces[name];
        if (!netInterface) continue;

        const hasActiveConnection = netInterface.some(
            (addr) =>
                (addr.family === "IPv4" || addr.family === "IPv6") &&
                !addr.internal &&
                addr.address !== "127.0.0.1" &&
                addr.address !== "::1"
        );

        if (hasActiveConnection) {
            return true;
        }
    }

    return false;
}

export const HAS_INTERNET = hasInternetConnection();
