#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";
import {
  statementRunPromise,
  getFromTablePromise,
} from "./db-promise-functions.js";

const db = new sqlite3.Database(":memory:");

statementRunPromise(
  db.prepare(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  ),
)
  .then(() =>
    statementRunPromise(
      db.prepare("INSERT INTO books (title) VALUES (?)"),
      "Rubyの本",
    ),
  )
  .then((result) => {
    console.log(`id: ${result.lastID}`);
    return getFromTablePromise(
      db,
      "SELECT id, title FROM books WHERE id = ?",
      result.lastID,
    );
  })
  .then((record) => {
    console.log(record);
    return statementRunPromise(db.prepare("DROP TABLE books"));
  });

await timers.setTimeout(100);

statementRunPromise(
  db.prepare(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  ),
)
  .then(() =>
    statementRunPromise(db.prepare("INSERT INTO books (title) VALUES (?)")),
  )
  .catch((err) => {
    console.error(err.message);
    return getFromTablePromise(db, "SELECT body FROM books WHERE id = ?", 1);
  })
  .catch((err) => {
    console.error(err.message);
    return statementRunPromise(db.prepare("DROP TABLE books"));
  });
