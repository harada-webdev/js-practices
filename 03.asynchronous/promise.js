#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";
import {
  runFromStatementPromise,
  getFromDatabasePromise,
} from "./db-promise-functions.js";

const db = new sqlite3.Database(":memory:");

runFromStatementPromise(
  db.prepare(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  ),
)
  .then(() =>
    runFromStatementPromise(
      db.prepare("INSERT INTO books (title) VALUES (?)"),
      "Rubyの本",
    ),
  )
  .then((result) => {
    console.log(`id: ${result.lastID}`);
    return getFromDatabasePromise(
      db,
      "SELECT id, title FROM books WHERE id = ?",
      result.lastID,
    );
  })
  .then((record) => {
    console.log(record);
    return runFromStatementPromise(db.prepare("DROP TABLE books"));
  });

await timers.setTimeout(100);

runFromStatementPromise(
  db.prepare(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  ),
)
  .then(() =>
    runFromStatementPromise(db.prepare("INSERT INTO books (title) VALUES (?)")),
  )
  .catch((err) => {
    console.error(err.message);
    return getFromDatabasePromise(db, "SELECT body FROM books WHERE id = ?", 1);
  })
  .catch((err) => {
    console.error(err.message);
    return runFromStatementPromise(db.prepare("DROP TABLE books"));
  });
