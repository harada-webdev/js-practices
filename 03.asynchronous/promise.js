#!/usr/bin/env node

import { db, runQueryPromise, getQueryPromise } from "./promise-functions.js";
import timers from "timers/promises";

runQueryPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    return runQueryPromise(
      db,
      "INSERT INTO books (title) VALUES (?)",
      "Rubyの本",
    );
  })
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
    runQueryPromise(db, "DROP TABLE books");
  });

await timers.setTimeout(100);

runQueryPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    return runQueryPromise(db, "INSERT INTO books (title) VALUES (?)");
  })
  .catch((err) => {
    console.error(err.message);
    return getQueryPromise(db, "SELECT body FROM books WHERE id = ?", 1);
  })
  .catch((err) => {
    console.error(err.message);
    runQueryPromise(db, "DROP TABLE books");
  });
