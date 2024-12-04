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
    if (args.l) {
      await this.#memoAction.showList();
    } else if (args.r) {
      await this.#memoAction.showDetail();
    } else if (args.d) {
      await this.#memoAction.delete();
    } else {
      await this.#memoAction.save();
    }

    await this.#memoAction.finish();
  }
}
