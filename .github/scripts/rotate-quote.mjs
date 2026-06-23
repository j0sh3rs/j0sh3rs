#!/usr/bin/env node
// Rotates the philosophy quote in README.md between the
// <!-- quote start --> / <!-- quote end --> markers.
//
// Selection is DETERMINISTIC by UTC day-of-year, so re-running on the same
// day produces the identical block (idempotent — no spurious commits).

import { readFileSync, writeFileSync } from "node:fs";

const README = "README.md";
const QUOTES = "quotes.json";
const START = "<!-- quote start -->";
const END = "<!-- quote end -->";

function dayOfYearUTC(now) {
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const diff =
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start;
  return Math.floor(diff / 86_400_000); // ms per day
}

const quotes = JSON.parse(readFileSync(QUOTES, "utf8"));
if (!Array.isArray(quotes) || quotes.length === 0) {
  console.error(`No quotes found in ${QUOTES}`);
  process.exit(1);
}

const idx = dayOfYearUTC(new Date()) % quotes.length;
const { quote, author } = quotes[idx];

const block = `${START}\n> "${quote}"\n>\n> — *${author}*\n${END}`;

const readme = readFileSync(README, "utf8");
const startIdx = readme.indexOf(START);
const endIdx = readme.indexOf(END);
if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
  console.error(`Quote markers not found (or out of order) in ${README}`);
  process.exit(1);
}

const updated =
  readme.slice(0, startIdx) + block + readme.slice(endIdx + END.length);

if (updated === readme) {
  console.log("Quote already current; no change.");
} else {
  writeFileSync(README, updated);
  console.log(`Quote set to #${idx}: ${author}`);
}
