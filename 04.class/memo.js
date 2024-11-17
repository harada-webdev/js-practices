#!/usr/bin/env node

import minimist from "minimist";
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
    const args = minimist(process.argv.slice(2));
    if (args.l) {
      await MemoAction.showList(this.db);
    } else if (args.r) {
      await MemoAction.showDetail(this.db);
    } else {
      await MemoAction.save(this.db);
    }
  }
}

new Memo().run();
