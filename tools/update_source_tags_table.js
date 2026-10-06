import path from 'path';
import { fileURLToPath } from 'url';

import { config } from 'dotenv';

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_FILE = process.argv[2] || '.env';
console.log("Loading config file: " + CONFIG_FILE);

config({ path: CONFIG_FILE });

let DATABASE_FILE = process.env.DATABASE_FILE || 'data.db';
if (DATABASE_FILE[0] !== '/') {
    DATABASE_FILE = path.join(__dirname, '..', DATABASE_FILE);
}

console.log(DATABASE_FILE);
const db = await open({
    filename: DATABASE_FILE,
    driver: sqlite3.Database
});

const sources = await db.all('SELECT id, tags FROM Sources');
const tagIds = new Map(
    (await db.all('SELECT id, tag FROM Tags')).map(t => [t.tag, t.id])
);
const missing = new Set();

await db.exec('BEGIN');
try {
    await db.run('DELETE FROM SourcesTags');
    const insert = await db.prepare('INSERT OR REPLACE INTO SourcesTags VALUES (?, ?)');
    for (const source of sources) {
        for (const tag of source.tags.split('|')) {
            const tagId = tagIds.get(tag);
            if (tagId === undefined) {
                if (!missing.has(tag)) {
                    console.log(`${tag} not found in Tags for source ID ${source.id}, skipping`);
                    missing.add(tag);
                }
                continue;
            }
            await insert.run(source.id, tagId);
        }
    }
    await insert.finalize();
    await db.exec('COMMIT');
} catch (err) {
    await db.exec('ROLLBACK');
    throw err;
}

console.log(`\nNumber of missing tags: ${missing.size}`);

await db.close();
console.log("Finished");
