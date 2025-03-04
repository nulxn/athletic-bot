console.clear();

console.log("\x1b[34m%s\x1b[0m", "Meet Creation Tool\n");

import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { createUser } from "./db.js";

const meets = JSON.parse(fs.readFileSync("meets.json"));
const db = new sqlite3.Database("storage.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the database.");
  }
});

async function getUsers() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM user", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function populateUsers() {
  await createUser("1", "123", "nolan");
  await createUser("2", "456", "rocco");
}

async function main() {
  //await populateUsers();
  const users = await getUsers();

  console.log(users);
}

main();
