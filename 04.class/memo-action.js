import readline from "readline";
import enquirer from "enquirer";
import MemoDatabase from "./memo-database.js";

export default class MemoAction {
  #memoDatabase;

  constructor() {
    this.#memoDatabase = new MemoDatabase();
  }

  async start() {
    await this.#memoDatabase.createTable();
  }

  async finish() {
    await this.#memoDatabase.close();
  }

  async save() {
    if (process.stdin.isTTY) {
      console.log("メモを入力してください:");
    }

    let memo;
    try {
      memo = await this.#userInput();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        process.exit(1);
      } else {
        throw error;
      }
    }

    await this.#memoDatabase.insert(memo.join("\n"));
    console.log("メモが保存されました");
  }

  async showList() {
    const memos = await this.#memoDatabase.getAll();
    if (memos.length === 0) {
      console.log("保存されているメモはありません。");
      process.exit(0);
    }

    memos.forEach((memo) => {
      console.log(memo.body.split("\n")[0] || "無題");
    });
  }

  async showDetail() {
    const memos = await this.#memoDatabase.getAll();
    if (memos.length === 0) {
      console.log("保存されているメモはありません。");
      process.exit(0);
    }

    const memoSelection = this.#getMemoSelection(memos, "show");
    let selectedMemo;
    try {
      selectedMemo = await enquirer.prompt(memoSelection);
    } catch (error) {
      if (error === "") {
        process.exit(130);
      } else {
        throw error;
      }
    }

    console.log(selectedMemo.show.body);
  }

  async delete() {
    const memos = await this.#memoDatabase.getAll();
    if (memos.length === 0) {
      console.log("保存されているメモはありません。");
      process.exit(0);
    }

    const memoSelection = this.#getMemoSelection(memos, "delete");
    let selectedMemo;
    try {
      selectedMemo = await enquirer.prompt(memoSelection);
    } catch (error) {
      if (error === "") {
        process.exit(130);
      } else {
        throw error;
      }
    }
    await this.#memoDatabase.delete(selectedMemo.delete.id);

    console.log("メモが削除されました");
  }

  #userInput() {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
      });
      let memoLines = [];

      rl.on("line", (input) => {
        memoLines.push(input);
      });

      rl.on("close", () => {
        if (memoLines.every((line) => line.trim() === "")) {
          reject(new Error("エラー: メモが何も入力されませんでした"));
        } else {
          resolve(memoLines);
        }
      });
    });
  }

  #getMemoSelection(memos, purpose) {
    return {
      type: "select",
      name: purpose,
      message:
        purpose === "show"
          ? "表示するメモを選んでください"
          : "削除するメモを選んでください",
      choices: memos.map((memo) => ({
        message: memo.body.split("\n")[0] || "無題",
        name: memo.body.split("\n")[0] || "無題",
        value: memo,
      })),
      footer() {
        return `\n${memos[this.index].body}`;
      },
      result() {
        return this.focused.value;
      },
    };
  }
}
