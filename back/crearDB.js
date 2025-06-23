const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Ruta de la carpeta y archivo de la base de datos
const dbFolder = path.join(__dirname, "database");
const dbPath = path.join(dbFolder, "db_powergym.sqlite");

// Crear la carpeta si no existe
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder);
  console.log("📁 Carpeta 'database' creada.");
}

// Eliminar base de datos anterior si existe
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log("🧹 Base de datos anterior eliminada.");
}

const db = new sqlite3.Database(dbPath);

const sqlInit = `
DROP TABLE IF EXISTS accesos;
DROP TABLE IF EXISTS caja;
DROP TABLE IF EXISTS cobros;
DROP TABLE IF EXISTS deudas;
DROP TABLE IF EXISTS planes;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS socios;

CREATE TABLE socios (
  id_socio INTEGER PRIMARY KEY,
  Documento INTEGER NOT NULL UNIQUE,
  Apellido TEXT NOT NULL,
  Nombre TEXT NOT NULL,
  Sexo TEXT NOT NULL,
  Domicilio TEXT,
  Localidad TEXT,
  Telefono INTEGER,
  TelefonoUrgencia INTEGER,
  Info TEXT,
  Alergia TEXT,
  Medicacion TEXT,
  Habilitado INTEGER DEFAULT 1,
  FechaIngreso TEXT,
  FechaNac TEXT,
  id_plan INTEGER
);

CREATE TABLE planes (
  id_plan INTEGER PRIMARY KEY,
  Abreviatura TEXT NOT NULL UNIQUE,
  Descripcion TEXT NOT NULL,
  Precio REAL,
  Clases REAL
);

CREATE TABLE roles (
  id_roles INTEGER PRIMARY KEY,
  usuario TEXT NOT NULL,
  pass TEXT NOT NULL
);

CREATE TABLE cobros (
  id_cobro INTEGER PRIMARY KEY,
  id_socio INTEGER,
  fecha_cobro TEXT,
  vencimiento TEXT,
  importe REAL,
  saldo REAL DEFAULT 0.0,
  descuento REAL DEFAULT 0.0,
  motivo_descuento TEXT,
  tipo_pago TEXT
);

CREATE TABLE caja (
  id_caja INTEGER PRIMARY KEY,
  id_cobro INTEGER,
  tipo_movimiento TEXT NOT NULL,
  detalle TEXT NOT NULL,
  socio_nombre TEXT NOT NULL,
  dni INTEGER NOT NULL,
  fecha TEXT NOT NULL,
  hora TEXT NOT NULL,
  tipo_pago TEXT,
  debe REAL DEFAULT 0.0,
  haber REAL DEFAULT 0.0,
  saldo REAL DEFAULT 0.0
);

CREATE TABLE deudas (
  id_deuda INTEGER PRIMARY KEY,
  id_socio INTEGER,
  fecha TEXT,
  monto REAL,
  detalles TEXT
);

CREATE TABLE accesos (
  id INTEGER PRIMARY KEY,
  Documento INTEGER,
  HoraEntrada TEXT
);

-- Inserciones de ejemplo:
INSERT INTO planes VALUES (17,'aparatos','aparatos',9500.00,12.00);
INSERT INTO roles VALUES (1,'admin','123'),(2,'emple','1234');
INSERT INTO socios VALUES (
  38,12345678,'Medrano','Facundo medrano','MASCULINO',
  NULL,'BANDA DEL RIO SALI - (CP: 4109)',3815730935,NULL,
  NULL,NULL,NULL,1,'2025-06-22','2025-06-22',17
);
`;

db.exec(sqlInit, (err) => {
  if (err) {
    console.error("❌ Error al crear la base de datos:", err.message);
  } else {
    console.log("✅ Base de datos creada correctamente.");
    console.log(`📂 Ruta: ${dbPath}`);
  }
  db.close();
});
