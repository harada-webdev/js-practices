#!/usr/bin/env node

import { db, runQueryPromise, getQueryPromise } from "./promise-functions.js";

await runQueryPromise(
  db.prepare(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  ),
);

const result = await runQueryPromise(
  db.prepare("INSERT INTO books (title) VALUES (?)"),
  "JavaScriptの本",
);
console.log(`id: ${result.lastID}`);

const record = await getQueryPromise(
  db,
  "SELECT id, title FROM books WHERE id = ?",
  result.lastID,
);
console.log(record);

await runQueryPromise(db.prepare("DROP TABLE books"));

await runQueryPromise(
  db.prepare(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  ),
);

try {
  await runQueryPromise(db.prepare("INSERT INTO books (title) VALUES (?)"));
} catch (err) {
  console.error(err.message);
}

try {
  await getQueryPromise(db, "SELECT body FROM books WHERE id = ?", 1);
} catch (err) {
  console.error(err.message);
}

await runQueryPromise(db.prepare("DROP TABLE books"));
