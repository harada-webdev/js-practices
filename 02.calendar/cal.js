#!/usr/bin/env node

import minimist from "minimist";

const today = new Date();
const argv = minimist(process.argv.slice(2), {
  default: {
    y: today.getFullYear(),
    m: today.getMonth() + 1,
  },
});
const firstDay = new Date(argv.y, argv.m - 1);
const lastDay = new Date(argv.y, argv.m, 0);

console.log(`${" ".repeat(6)}${argv.m}月 ${argv.y}`);
console.log("日 月 火 水 木 金 土");
process.stdout.write(" ".repeat(firstDay.getDay() * 3));
for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
  const formattedDay = day.getDate().toString().padStart(2);
  if (day.getDay() === 6 || day.getDate() === lastDay.getDate()) {
    console.log(formattedDay);
  } else {
    process.stdout.write(formattedDay.padEnd(3));
  }
}
console.log();
