#!/usr/bin/env node

import minimist from "minimist";

const today = new Date();
const argv = minimist(process.argv.slice(2), {
  default: {
    y: today.getFullYear(),
    m: today.getMonth() + 1,
  },
});
const year = argv.y;
const month = argv.m;
const firstDay = new Date(year, month - 1);
const lastDay = new Date(year, month, 0);

console.log(`${"".padStart(6)}${month}月 ${year}`);
console.log("日 月 火 水 木 金 土");
process.stdout.write("".padStart(firstDay.getDay() * 3));
for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
  process.stdout.write(`${day.getDate().toString().padStart(2).padEnd(3)}`);
  process.stdout.write(day.getDay() === 6 && day < lastDay ? `\n` : "");
}
console.log(`\n`);
