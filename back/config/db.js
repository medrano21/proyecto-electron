const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Ruta al archivo de base de datos
const dbPath = path.join(__dirname, "../database/db_powergym.sqlite");
console.log("🧩 Ruta DB:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error al conectar a SQLite:", err.message);
  } else {
    console.log("✅ Conectado a SQLite");
  }
});

module.exports = db;
