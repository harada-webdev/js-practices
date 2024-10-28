#!/usr/bin/env node

import minimist from "minimist";
const argv = minimist(process.argv.slice(2), {
  default: {
    y: new Date().getFullYear(),
    m: new Date().getMonth() + 1,
  },
});
const year = argv.y;
const month = argv.m;
const firstDay = new Date(year, month - 1);
const lastDay = new Date(year, month, 0);

console.log(`      ${month}月 ${year}`);
console.log("日 月 火 水 木 金 土");
process.stdout.write("   ".repeat(firstDay.getDay()));
for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
  const formattedDay = day.getDate().toString().padStart(2);
  process.stdout.write(
    day.getDay() === 6 ? `${formattedDay}\n` : `${formattedDay} `,
  );
}
console.log(`\n`);
