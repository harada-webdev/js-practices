#!/usr/bin/env node

import sqlite3 from "sqlite3";
import {
  statementRunPromise,
  getFromTablePromise,
} from "./db-promise-functions.js";

const db = new sqlite3.Database(":memory:");

await statementRunPromise(
  db.prepare(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  ),
);

const result = await statementRunPromise(
  db.prepare("INSERT INTO books (title) VALUES (?)"),
  "JavaScriptの本",
);
console.log(`id: ${result.lastID}`);

const record = await getFromTablePromise(
  db,
  "SELECT id, title FROM books WHERE id = ?",
  result.lastID,
);
console.log(record);

await statementRunPromise(db.prepare("DROP TABLE books"));

await statementRunPromise(
  db.prepare(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  ),
);

try {
  await statementRunPromise(db.prepare("INSERT INTO books (title) VALUES (?)"));
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_CONSTRAINT") {
    console.error(err.message);
  } else {
    throw err;
  }
}

try {
  await getFromTablePromise(db, "SELECT body FROM books WHERE id = ?", 1);
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    throw err;
  }
}

await statementRunPromise(db.prepare("DROP TABLE books"));
