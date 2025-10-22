export const VALID_MCPE_PACKAGES = [
    "@minecraft/server",
    "@minecraft/server-ui",
    "@minecraft/server-net",
    "@minecraft/server-admin",
    "@minecraft/server-gametest",
    "@minecraft/debug-utilities",
    "@minecraft/server-graphics"
];

export type validPackageNames = (typeof VALID_MCPE_PACKAGES)[number];
