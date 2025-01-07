const { ModuleManager } = require("../models/files/moduleManager");
const { ColorLogger } = require("../models/cli/colorLogger");
const Database = require("better-sqlite3");
const fs = require("fs");
const zlib = require("zlib");
const crypto = require("crypto");
const { readConfig } = require("../utils/config");
const { PROJECT_PATH_SRC } = require("../constants/paths");

const projectId = readConfig().id;

if (!projectId) {
    return;
}

ModuleManager.addModule({
    name: "backup",
    description: "Backups files for your current project",
    activator: () => true,
    onLaunch: () => {
        const db = new Database(PROJECT_PATH_SRC + `data/backups/${projectId}.db`);

        db.exec(`
    CREATE TABLE IF NOT EXISTS file_metadata (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_path TEXT NOT NULL,
        version INTEGER NOT NULL,
        project_id INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);
        db.exec(`
    CREATE TABLE IF NOT EXISTS file_contents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_id INTEGER NOT NULL,
        content BLOB NOT NULL,
        hash TEXT NOT NULL,
        project_id INTEGER NOT NULL,
        FOREIGN KEY (file_id) REFERENCES file_metadata(id)
    )
`);
    },
    handleFile: async (filePath) => {
        const content = await fs.promises.readFile(filePath);
        const compressedContent = zlib.gzipSync(content);
        const hash = crypto.createHash("sha256").update(compressedContent).digest("hex");

        const insertMetadata = db.prepare(`INSERT INTO file_metadata (file_path, version, project_id) VALUES (?, ?, ?)`);
        const selectContent = db.prepare(`SELECT id FROM file_contents WHERE hash = ? AND project_id = ?`);
        const insertContent = db.prepare(`INSERT INTO file_contents (file_id, content, hash, project_id) VALUES (?, ?, ?, ?)`);

        const info = insertMetadata.run(filePath, Date.now(), projectId);
        const fileId = info.lastInsertRowid;

        const row = selectContent.get(hash, projectId);
        if (!row) {
            insertContent.run(fileId, compressedContent, hash, projectId);
            ColorLogger.moduleLog(`File ${filePath} backed up successfully.`);
        } else {
            ColorLogger.moduleLog(`File ${filePath} already backed up.`);
        }
    },
});

async function rollbackFile(projectId, filePath, version) {
    const selectMetadata = db.prepare(`SELECT id FROM file_metadata WHERE file_path = ? AND version = ? AND project_id = ?`);
    const selectContent = db.prepare(`SELECT content FROM file_contents WHERE file_id = ? AND project_id = ?`);

    const row = selectMetadata.get(filePath, version, projectId);
    if (row) {
        const fileId = row.id;
        const contentRow = selectContent.get(fileId, projectId);
        if (contentRow) {
            const decompressedContent = zlib.gunzipSync(contentRow.content);
            try {
                await fs.promises.writeFile(filePath, decompressedContent);
                ColorLogger.moduleLog(`File ${filePath} rolled back to version ${version} successfully.`);
            } catch (err) {
                console.error(err.message);
            }
        }
    }
}
