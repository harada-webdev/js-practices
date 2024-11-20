import readline from "readline";
import enquirer from "enquirer";

export class MemoAction {
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

    await db.run("INSERT INTO memos (body) VALUES (?)", memo);
    console.log("メモが保存されました");
  }

  static showList = async (db) => {
    const memos = await this.#getAll(db);
    memos.forEach((memo) => {
      console.log(memo.body.split("\n")[0]);
    });
  };

  static showDetail = async (db) => {
    const memos = await this.#getAll(db);
    const list = await this.#selection(memos, "show");
    const selectedMemo = await enquirer.prompt(list);
    console.log(selectedMemo.show.body);
  };

  static delete = async (db) => {
    const memos = await this.#getAll(db);
    const list = await this.#selection(memos, "delete");
    const selectedMemo = await enquirer.prompt(list);
    await db.run("DELETE FROM memos WHERE id = ?", selectedMemo.delete.id);
    console.log("メモが削除されました");
  };

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

  static #getAll = async (db) => {
    const memos = await db.getAll("SELECT * FROM memos");
    if (memos.length === 0) {
      console.log("保存されているメモはありません。");
      process.exit(0);
    }
    return memos;
  };

  static #selection = async (memos, purpose) => {
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
  };
}
