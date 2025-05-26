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

fs.createReadStream("./public/tags.tsv")
    .pipe(parse({ delimiter: "\t", from_line: 2 }))
    .on("data", function (data) {
        // console.log(row);
        db.run('INSERT OR REPLACE INTO Tags(id, tag, embedX, embedY, counts) VALUES (?, ?, ?, ?, ?)', [
            data[0], data[1], data[2], data[3], data[4]
        ]);
    })
    .on("end", async function () {
        await db.close();
        console.log("finished");
    })
    .on("error", function (error) {
        console.log(error.message);
    });
