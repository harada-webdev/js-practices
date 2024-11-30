import sqlite3 from "sqlite3";

export default class MemoDatabase {
  #db;

  constructor() {
    this.#db = new sqlite3.Database("memo.db");
  }

  async createTable() {
    await this.#runPromise(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT NOT NULL)",
    );
  }

  async insert(body) {
    await this.#runPromise("INSERT INTO memos (body) VALUES (?)", body);
  }

  async delete(id) {
    await this.#runPromise("DELETE FROM memos WHERE id = ?", id);
  }

  async getAll() {
    return await this.#getAllPromise("SELECT * FROM memos ORDER BY id");
  }

  async close() {
    return await this.#closePromise();
  }

  #runPromise(query, params) {
    return new Promise((resolve, reject) => {
      this.#db.run(query, params, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });
    });
  }

  #getAllPromise(query) {
    return new Promise((resolve, reject) => {
      this.#db.all(query, (error, records) => {
        if (error) {
          reject(error);
        } else {
          resolve(records);
        }
      });
    });
  }

  #closePromise() {
    return new Promise((resolve, reject) => {
      this.#db.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
