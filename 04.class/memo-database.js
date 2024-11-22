import sqlite3 from "sqlite3";

export default class MemoDatabase {
  constructor() {
    this.db = new sqlite3.Database("memo.db");
  }

  async createTable() {
    await this.#runPromise(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT NOT NULL)",
    );
  }

  async insert(params) {
    await this.#runPromise("INSERT INTO memos (body) VALUES (?)", params);
  }

  async delete(params) {
    await this.#runPromise("DELETE FROM memos WHERE id = ?", params);
  }

  async getAll() {
    return await this.#getAllPromise("SELECT * FROM memos ORDER BY id");
  }

  async close() {
    return await this.#closePromise();
  }

  #runPromise(query, params) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  #getAllPromise(query) {
    return new Promise((resolve, reject) => {
      this.db.all(query, (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });
  }

  #closePromise() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
