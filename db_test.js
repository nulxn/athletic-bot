import sqlite3 from "sqlite3";

const db = new sqlite3.Database("database.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the database.");
  }
});

function initDb() {
  db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            athleticId TEXT,
            cardIds TEXT
        )
    `);
}

function getUser(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function createUser(id) {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO users (id) VALUES (?)`, [id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function addAthleticId(id, athleticId) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users SET athleticId = ? WHERE id = ?`,
      [athleticId, id],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

function addCardId(id, cardId) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT cardIds FROM users WHERE id = ?`, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        let cardIds = row.cardIds ? row.cardIds.split(",") : [];
        cardIds.push(cardId);
        db.run(
          `UPDATE users SET cardIds = ? WHERE id = ?`,
          [cardIds.join(","), id],
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      }
    });
  });
}

export { db, initDb, getUser, createUser, addAthleticId, addCardId };
