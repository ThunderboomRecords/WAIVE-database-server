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
const db = await open({
    filename: DATABASE_FILE,
    driver: sqlite3.Database
});
// Wait up to 10 s for other connections (e.g. the web server) to release locks
await db.run('PRAGMA busy_timeout = 10000');
// Let readers (e.g. the web server) keep reading while this script writes
await db.run('PRAGMA journal_mode = WAL');

let count = 0;

await db.exec('BEGIN IMMEDIATE');
try {
    await db.run('DELETE FROM Sources');
    await db.run('DELETE FROM Archives');
    console.log('Cleared Sources and Archives');

    const insert_source = await db.prepare('INSERT OR REPLACE INTO Sources(id, archive, description, tags, filename, license) VALUES (?, ?, ?, ?, ?, ?)');
    const insert_archive = await db.prepare('INSERT OR IGNORE INTO Archives(name) VALUES (?)');

    const parser = fs.createReadStream("./public/all_samples_data.tsv")
        .pipe(parse({ delimiter: "\t", from_line: 2 }));

    for await (const data of parser) {
        await insert_source.run(data[0], data[5], data[1], data[2], data[4], data[7]);
        await insert_archive.run(data[5]);
        count++;
        process.stdout.write(`\rCount: ${count}`);
    }

    await insert_source.finalize();
    await insert_archive.finalize();
    await db.exec('COMMIT');
} catch (err) {
    await db.exec('ROLLBACK');
    console.log();
    throw err;
}

await db.close();
console.log("\nfinished");
