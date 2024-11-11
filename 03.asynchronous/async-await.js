#!/usr/bin/env node

import sqlite3 from "sqlite3";
import {
  runFromStatementPromise,
  getFromDatabasePromise,
} from "./db-promise-functions.js";

const db = new sqlite3.Database(":memory:");

await runFromStatementPromise(
  db.prepare(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  ),
);

const result = await runFromStatementPromise(
  db.prepare("INSERT INTO books (title) VALUES (?)"),
  "JavaScriptの本",
);
console.log(`id: ${result.lastID}`);

const record = await getFromDatabasePromise(
  db,
  "SELECT id, title FROM books WHERE id = ?",
  result.lastID,
);
console.log(record);

await runFromStatementPromise(db.prepare("DROP TABLE books"));

await runFromStatementPromise(
  db.prepare(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  ),
);

try {
  await runFromStatementPromise(
    db.prepare("INSERT INTO books (title) VALUES (?)"),
  );
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_CONSTRAINT") {
    console.error(err.message);
  } else {
    throw err;
  }
}

try {
  await getFromDatabasePromise(db, "SELECT body FROM books WHERE id = ?", 1);
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    throw err;
  }
}

await runFromStatementPromise(db.prepare("DROP TABLE books"));
