import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from 'dotenv';

import { parse } from 'csv-parse';
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
let dbPromise = open({
    filename: DATABASE_FILE,
    driver: sqlite3.Database
});
const db = await dbPromise;
const sources = await db.all('SELECT * FROM Sources');

let tagCache = {};

for (const source of sources) {
    for (const tag of source.tags.split('|')) {

        let tagId = tagCache[tag];
        if (tagId === undefined) {
            const tagRow = await db.get('SELECT * FROM Tags WHERE tag = ?', [tag]);
            if (!tagRow) {
                console.log(`${tag} not found in Tags, skipping`);
                tagCache[tag] = -1;
                continue;
            }
            tagCache[tag] = tagRow.id;
            tagId = tagRow.id;
        }
        else if (tagId == -1)
            continue;

        await db.run('INSERT OR REPLACE INTO SourcesTags VALUES (?, ?)', [source.id, tagId]);
    }
}

await db.close();
console.log("Finished");