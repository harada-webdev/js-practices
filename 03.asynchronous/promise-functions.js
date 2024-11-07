import sqlite3 from "sqlite3";

export const db = new sqlite3.Database(":memory:");

export const runQueryPromise = (db, query, params = []) =>
  new Promise((resolve, reject) => {
    const statement = db.prepare(query);
    statement.run(params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(statement);
      }
    });
  });

export const getQueryPromise = (db, query, params = []) =>
  new Promise((resolve, reject) => {
    db.get(query, params, (err, record) => {
      if (err) {
        reject(err);
      } else {
        resolve(record);
      }
    });
  });
