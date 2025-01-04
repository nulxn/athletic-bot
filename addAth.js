console.clear();

console.log("\x1b[34m%s\x1b[0m", "Athlete Adding Tool\n");

import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";

const athletes = JSON.parse(fs.readFileSync("athletes.json"));
const db = new sqlite3.Database("storage.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the database.");
  }
});

function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

async function createAthlete(athlete) {
  const stmt = await db.prepare(
    "INSERT INTO athlete (name, athletic, prs, school, grade, gender, icon, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  await stmt.run(
    athlete.Name,
    athlete.ID,
    JSON.stringify(athlete.prs?.filter((pr) => pr.event) ?? []),
    athlete.team,
    "9",
    athlete.Gender,
    athlete.icon,
    null,
    async function (err) {
      if (err) {
        await console.error(`\t Error: ${err.message}`);
      } else {
        await console.log(
          `\tA row has been inserted with rowid ${this.lastID}`
        );
      }
      await stmt.finalize();
    }
  );
}

async function createAthletes(athletes) {
  for (const athlete of athletes) {
    await createAthlete(athlete);
  }
}

async function main() {
  try {
    await runQuery(`
      CREATE TABLE IF NOT EXISTS athlete (
        id INTEGER PRIMARY KEY,
        name TEXT,
        athletic TEXT,
        prs TEXT,
        school TEXT,
        grade TEXT,
        gender TEXT,
        icon TEXT,
        owner_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES user(id)
      )
    `);
    await createAthletes(athletes);
  } catch (err) {
    console.error("Error during main execution:", err.message);
  }
}

main();
