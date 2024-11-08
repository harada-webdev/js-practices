#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    const statement = db.prepare("INSERT INTO books (title) VALUES (?)");
    statement.run("HTMLの本", () => {
      console.log(`id: ${statement.lastID}`);
      db.get(
        "SELECT id, title FROM books WHERE id = ?",
        statement.lastID,
        (_, record) => {
          console.log(record);
          db.run("DROP TABLE books");
        },
      );
    });
  },
);

await timers.setTimeout(100);

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books (title) VALUES (?)", (err) => {
      console.error(err.message);
      db.get("SELECT body FROM books WHERE id = ?", 1, (err) => {
        console.error(err.message);
        db.run("DROP TABLE books");
      });
    });
  },
);
