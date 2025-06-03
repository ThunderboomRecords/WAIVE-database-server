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

let user_version = Math.floor(Date.now() / 1000);
console.log(`Updating user_version to ${user_version}`);
await db.run(`PRAGMA user_version = ${user_version}`, [], (err) => {
    console.log(err);
});

console.log("Finished");
