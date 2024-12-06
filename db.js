import sqlite3 from "sqlite3";

const db = new sqlite3.Database("storage.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the database.");
  }
});

function init() {
  db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY,
      athleticid TEXT,
      name TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS athlete (
      id INTEGER PRIMARY KEY,
      name TEXT,
      athletic TEXT,
      prs TEXT,
      school TEXT,
      grade TEXT,
      owner_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES user(id)
    )
  `);
}

function createUser(id, athleticid, name) {
  const stmt = db.prepare(
    "INSERT INTO user (id, athleticid, name) VALUES (?, ?, ?)"
  );
  stmt.run(id, athleticid, name, function (err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    }
    stmt.finalize();
  });
}

function claimAthlete(id, owner_id) {
  const stmt = db.prepare("UPDATE athlete SET owner_id = ? WHERE id = ?");
  stmt.run(owner_id, id, function (err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(
        `Athlete with id ${id} has been claimed by user with id ${owner_id}`
      );
    }
    stmt.finalize();
  });
}

function getUserWithAthletes(id) {
  const userQuery = "SELECT * FROM user WHERE id = ?";
  const athletesQuery = "SELECT * FROM athlete WHERE owner_id = ?";

  return new Promise((resolve, reject) => {
    db.get(userQuery, [id], (err, user) => {
      if (err) {
        console.error(err.message);
        reject(err);
        return;
      }

      if (!user) {
        resolve(null);
        return;
      }

      db.all(athletesQuery, [id], (err, athletes) => {
        if (err) {
          console.error(err.message);
          reject(err);
          return;
        }

        user.athletes = athletes;
        resolve(user);
      });
    });
  });
}

function getUserById(id) {
  const query = "SELECT * FROM user WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, user) => {
      if (err) {
        console.error(err.message);
        reject(err);
        return;
      }

      resolve(user);
    });
  });
}

function getAllAthletes() {
  const query = "SELECT * FROM athlete";
  return new Promise((resolve, reject) => {
    db.all(query, (err, athletes) => {
      if (err) {
        console.error(err.message);
        reject(err);
        return;
      }

      resolve(athletes);
    });
  });
}

export {
  db,
  init,
  createUser,
  claimAthlete,
  getUserWithAthletes,
  getUserById,
  getAllAthletes,
};
