import { spawnSync } from "node:child_process";

export function hasCli(cli: string): boolean {
    return spawnSync("where", [cli], { stdio: "ignore" }).status === 0;
}
