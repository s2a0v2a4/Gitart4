const { execSync } = require("node:child_process");
const { appendFileSync } = require("node:fs");

const YEAR = 2026;
const start = Date.UTC(2025, 11, 28, 12);

const pattern = [
  "00444000044400040004000444000000004440000000000000000",
  "04000400400040040004004000400000040004000000000000000",
  "04000000400040040004004000400000000004000000000000000",
  "00444000444440040004004000400000000040004044000004000",
  "00000400400040040004004000400000000004004400000040400",
  "04000400400040040004004000400440040004004000000400400",
  "00444000400040004440000444000440004440004000004004000",
];

const commitsPerLevel = [0, 1, 2, 3, 4];

if (new Date(start).getUTCDay() !== 0) throw new Error("Start ist kein Sonntag");

for (let col = 0; col < 53; col++) {
  for (let row = 0; row < 7; row++) {
    const level = Number(pattern[row][col]);
    if (!level) continue;
    const d = new Date(start + (col * 7 + row) * 86400000);
    if (d.getUTCFullYear() !== YEAR) continue;
    const iso = d.toISOString();
    for (let i = 0; i < commitsPerLevel[level]; i++) {
      appendFileSync("gitart.log", `${iso} #${i}\n`);
      execSync("git add gitart.log");
      execSync(`git commit -m "art ${iso}"`, {
        env: { ...process.env, GIT_AUTHOR_DATE: iso, GIT_COMMITTER_DATE: iso },
        stdio: "ignore",
      });
    }
  }
}
console.log("Fertig");
