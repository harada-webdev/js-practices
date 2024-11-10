#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";
import { runQueryPromise, getQueryPromise } from "./promise-functions.js";

const db = new sqlite3.Database(":memory:");

runQueryPromise(
  db.prepare(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  ),
)
  .then(() =>
    runQueryPromise(
      db.prepare("INSERT INTO books (title) VALUES (?)"),
      "Rubyの本",
    ),
  )
  .then((result) => {
    console.log(`id: ${result.lastID}`);
    return getQueryPromise(
      db,
      "SELECT id, title FROM books WHERE id = ?",
      result.lastID,
    );
  })
  .then((record) => {
    console.log(record);
    runQueryPromise(db.prepare("DROP TABLE books"));
  });

await timers.setTimeout(100);

runQueryPromise(
  db.prepare(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  ),
)
  .then(() =>
    runQueryPromise(db.prepare("INSERT INTO books (title) VALUES (?)")),
  )
  .catch((err) => {
    console.error(err.message);
    return getQueryPromise(db, "SELECT body FROM books WHERE id = ?", 1);
  })
  .catch((err) => {
    console.error(err.message);
    runQueryPromise(db.prepare("DROP TABLE books"));
  });
