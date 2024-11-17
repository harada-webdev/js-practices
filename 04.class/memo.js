#!/usr/bin/env node

import { MemoDatabase } from "./memo-database.js";

class Memo {
  constructor() {
    this.db = new MemoDatabase();
  }

  async run() {
    await this.db.createTable();
    await this.db.close();
  }
}

new Memo().run();
