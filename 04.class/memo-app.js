import minimist from "minimist";
import MemoAction from "./memo-action.js";

export default class MemoApp {
  #memoAction;

  constructor() {
    this.#memoAction = new MemoAction();
  }

  async run() {
    await this.#memoAction.start();

    const args = minimist(process.argv.slice(2));
    let exitStatus = 0;
    try {
      if (args.l) {
        await this.#memoAction.showList();
      } else if (args.r) {
        exitStatus = await this.#memoAction.showDetail();
      } else if (args.d) {
        exitStatus = await this.#memoAction.delete();
      } else {
        exitStatus = await this.#memoAction.save();
      }
    } finally {
      await this.#memoAction.finish();
      process.exit(exitStatus);
    }
  }
}
