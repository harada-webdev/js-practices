#!/usr/bin/env node

import sqlite3 from "sqlite3";
import {
  runStatementPromise,
  getQueryPromise,
} from "./db-promise-functions.js";

const db = new sqlite3.Database(":memory:");

await runStatementPromise(
  db.prepare(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  ),
);

const result = await runStatementPromise(
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

await runStatementPromise(db.prepare("DROP TABLE books"));

await runStatementPromise(
  db.prepare(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  ),
);

try {
  await runStatementPromise(db.prepare("INSERT INTO books (title) VALUES (?)"));
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_CONSTRAINT") {
    console.error(err.message);
  } else {
    throw err;
  }
}

try {
  await getQueryPromise(db, "SELECT body FROM books WHERE id = ?", 1);
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    throw err;
  }
}

await runStatementPromise(db.prepare("DROP TABLE books"));
