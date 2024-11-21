import readline from "readline";
import enquirer from "enquirer";

export default class MemoAction {
  static async save(db) {
    if (process.stdin.isTTY) {
      console.log("メモを入力してください:");
    }

    let memo;
    try {
      memo = await this.#input();
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        process.exit(1);
      } else {
        throw err;
      }
    }

    await db.insert(memo);
    console.log("メモが保存されました");
  }

  static async showList(db) {
    const memos = await db.getAll();
    this.#checkMemoExistence(memos);
    memos.forEach((memo) => {
      console.log(memo.body.split("\n")[0]);
    });
  }

  static async showDetail(db) {
    const memos = await db.getAll();
    this.#checkMemoExistence(memos);

    let memoSelection = await this.#selection(memos, "show");
    let selectedMemo = "";
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

  static async delete(db) {
    const memos = await db.getAll();
    this.#checkMemoExistence(memos);

    const memoSelection = await this.#selection(memos, "delete");
    let selectedMemo = "";
    try {
      selectedMemo = await enquirer.prompt(memoSelection);
    } catch (error) {
      if (error === "") {
        process.exit(130);
      } else {
        throw error;
      }
    }
    await db.delete(selectedMemo.delete.id);

    console.log("メモが削除されました");
  }

  static #input() {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
      });
      let memo = "";

      rl.on("line", (input) => {
        memo += input + "\n";
      });

      rl.on("close", () => {
        if (memo.trim() === "") {
          reject(new Error("エラー: メモが何も入力されませんでした"));
        } else {
          resolve(memo);
        }
      });
    });
  }

  static #checkMemoExistence(memos) {
    if (memos.length === 0) {
      console.log("保存されているメモはありません。");
      process.exit(0);
    }
    return memos;
  }

  static #selection(memos, purpose) {
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
        return "\n" + memos[this.index].body;
      },
      result() {
        return this.focused.value;
      },
    };
  }
}
