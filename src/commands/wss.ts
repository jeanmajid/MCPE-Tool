//? WSS command gone for now, so you can use the tool without the installation of node build tools

import { Command } from "../core/cli/command.js";
import { Logger } from "../core/logger/logger.js";

Command.command("wss")
    .description("Runs a websocket server with some cool stuff")
    .action(async () => {
        Logger.error("WSS command temporarily disabled");
    });

// import { Command } from "../core/cli/command.js";
// import { Logger } from "../core/logger/logger.js";
// import type { WebSocket } from "ws";
// import { generateUUIDv4 } from "../utils/id.js";

// const buttonStates = new Map();

// Command.command("wss")
//     .description("Runs a websocket server with some cool stuff")
//     .action(async () => {
//         const { default: keylistener } = await import("@jeanmajid/windows-keylistener");
//         const { WebSocketServer } = await import("ws");

//         keylistener.copyToClipboard("/wsserver localhost:8080");
//         Logger.info("Starting websocket server on port 8080, wss command copied to clipboard");
//         const connections: WebSocket[] = [];
//         const wss = new WebSocketServer({ port: 8080 });
//         wss.on("connection", (ws: WebSocket) => {
//             connections.push(ws);

//             ws.on("close", () => {
//                 const index = connections.indexOf(ws);
//                 if (index > -1) {
//                     connections.splice(index, 1);
//                 }
//             });
//         });

//         keylistener.start((keycode: number, isPressed: boolean) => {
//             buttonStates.set(keycode, isPressed);
//             if (buttonStates.get(162)) {
//                 switch (keycode) {
//                     case 80: // P
//                         for (const ws of connections) {
//                             sendCommand(ws, "gamemode spectator");
//                         }
//                         break;
//                     case 79: // O
//                         for (const ws of connections) {
//                             sendCommand(ws, "gamemode c");
//                         }
//                         break;
//                     case 73: // I
//                         for (const ws of connections) {
//                             sendCommand(ws, "gamemode s");
//                         }
//                         break;
//                 }
//             }
//         });
//     });

// function sendCommand(ws: WebSocket, command: string): void {
//     const msg = {
//         header: {
//             version: 1,
//             requestId: generateUUIDv4(),
//             messagePurpose: "commandRequest",
//             messageType: "commandRequest"
//         },
//         body: {
//             version: 1,
//             commandLine: command
//         }
//     };
//     ws.send(JSON.stringify(msg));
// }
