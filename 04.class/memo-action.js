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

  async finish(exitStatus = 0) {
    await this.#memoDatabase.close();
    process.exit(exitStatus);
  }

  async save() {
    if (process.stdin.isTTY) {
      console.log("メモを入力してください:");
    }

    let exitStatus;
    let memo;
    try {
      memo = await this.#getUserInput();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        exitStatus = 1;
      } else {
        throw error;
      }
    } finally {
      if (memo) {
        await this.#memoDatabase.insert(memo.join("\n"));
        console.log("メモが保存されました");
      }
      await this.finish(exitStatus);
    }
  }

  async showList() {
    const memos = await this.#memoDatabase.getAll();
    if (memos.length === 0) {
      console.log("保存されているメモはありません。");
      return;
    }

    memos.forEach((memo) => {
      console.log(this.#getMemoTitle(memo));
    });
  }

  async showDetail() {
    const memos = await this.#memoDatabase.getAll();
    if (memos.length === 0) {
      console.log("保存されているメモはありません。");
      return;
    }

    const memoSelection = this.#getMemoSelection(memos, "show");
    let selectedMemo;
    let exitStatus;
    try {
      selectedMemo = await enquirer.prompt(memoSelection);
    } catch (error) {
      if (error === "") {
        console.error("強制終了しました");
        exitStatus = 130;
      } else {
        throw error;
      }
    } finally {
      if (selectedMemo) {
        console.log(selectedMemo.show.body);
      }
      await this.finish(exitStatus);
    }
  }

  async delete() {
    const memos = await this.#memoDatabase.getAll();
    if (memos.length === 0) {
      console.log("保存されているメモはありません。");
      return;
    }

    const memoSelection = this.#getMemoSelection(memos, "delete");
    let selectedMemo;
    let exitStatus;
    try {
      selectedMemo = await enquirer.prompt(memoSelection);
    } catch (error) {
      if (error === "") {
        console.error("強制終了しました");
        exitStatus = 130;
      } else {
        throw error;
      }
    } finally {
      if (selectedMemo) {
        await this.#memoDatabase.delete(selectedMemo.delete.id);
        console.log("メモが削除されました");
      }
      await this.finish(exitStatus);
    }
  }

  #getUserInput() {
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
      message: this.#getInstructionMessage(purpose),
      choices: memos.map((memo) => ({
        message: this.#getMemoTitle(memo),
        name: this.#getMemoTitle(memo),
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

  #getInstructionMessage(purpose) {
    if (purpose === "show") {
      return "表示するメモを選んでください";
    } else if (purpose === "delete") {
      return "削除するメモを選んでください";
    }
  }

  #getMemoTitle(memo) {
    return memo.body.split("\n")[0] || "無題";
  }
}
