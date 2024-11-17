#!/usr/bin/env node

import { MemoDatabase } from "./memo-database.js";
import { MemoAction } from "./memo-action.js";

class Memo {
  constructor() {
    this.db = new MemoDatabase();
  }

  async run() {
    await this.db.createTable();
    await this.#runMemoAction();
    await this.db.close();
  }

  async #runMemoAction() {
    await MemoAction.save(this.db);
  }
}

new Memo().run();
