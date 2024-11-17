import readline from "readline";

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
}
