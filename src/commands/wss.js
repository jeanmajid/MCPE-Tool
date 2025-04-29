import { ColorLogger } from "../models/cli/colorLogger.js";
import { Command } from "../models/cli/command.js";

Command
    .command("wss")
    .description("Runs a websocket server with some cool stuff")
    .action(async () => {
        const { default: keylistener} = await import("@jeanmajid/windows-keylistener");
        const { WebSocketServer } = await import("ws");

        keylistener.copyToClipboard("/wsserver localhost:8080");
        ColorLogger.info("Starting websocket server on port 8080, wss command copied to clipboard");
        const connections = [];
        const wss = new WebSocketServer({ port: 8080 });
        wss.on("connection", (ws) => {
            connections.push(ws);
            
            ws.on("close", () => {
                const index = connections.indexOf(ws);
                if (index > -1) {
                    connections.splice(index, 1);
                }
            });
        });

        keylistener.start((keycode) => {
            switch (keycode) {
                case 80: // P
                    for (const ws of connections) {
                        sendCommand(ws, "gamemode spectator");
                    }
                    break;
                case 79: // O
                    for (const ws of connections) {
                        sendCommand(ws, "gamemode c");
                    }
                    break;
                case 73: // I
                    for (const ws of connections) {
                        sendCommand(ws, "gamemode s");
                    }
                    break;
            }
        });
    });

function sendCommand(ws, command) {
    const msg = {
        header: {
            version: 1,
            requestId: generateUUIDv4(),
            messagePurpose: "commandRequest",
            messageType: "commandRequest",
        },
        body: {
            version: 1,
            commandLine: command,
        },
    };
    ws.send(JSON.stringify(msg));
}

function generateUUIDv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
