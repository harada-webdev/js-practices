import sqlite3 from "sqlite3";

export default class MemoDatabase {
  constructor() {
    this.db = new sqlite3.Database("memo.db");
  }

  createTable = async () => {
    await this.run(`
        CREATE TABLE IF NOT EXISTS memos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          body TEXT NOT NULL
        );
      `);
  };

  close = () => {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  };

  run = (query, params) => {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  };

  getAll = (query, params) => {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });
  };
}
