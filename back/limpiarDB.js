const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbFolder = path.join(__dirname, "database");
const dbPath = path.join(dbFolder, "db_powergym.sqlite");

if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
  console.log("📁 Carpeta 'database' creada.");
}

if (!fs.existsSync(dbPath)) {
  console.error(
    "❌ La base de datos no existe. Ejecutá primero el generador completo."
  );
  process.exit(1);
}

const db = new sqlite3.Database(dbPath);

const sqlReset = `
DELETE FROM accesos;
DELETE FROM caja;
DELETE FROM cobros;
DELETE FROM deudas;
DELETE FROM planes;
DELETE FROM socios;

`;

db.exec(sqlReset, (err) => {
  if (err) {
    console.error("❌ Error al limpiar la base de datos:", err.message);
  } else {
    console.log("✅ Base de datos limpiada (roles conservados).");
  }
  db.close();
});
