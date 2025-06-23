const { app: electronApp, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");
const fs = require("fs");

// Ruta real de la base de datos dentro de tu proyecto
const databaseFile = path.join(__dirname, "database", "db_powergym.sqlite");

// Carpeta donde guardarás los backups en el escritorio
const backupDir = path.join(
  "C:",
  "Users",
  "USER",
  "OneDrive",
  "Escritorio",
  "backups"
);

// Crear carpeta backup si no existe
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(
    backupDir,
    `db_powergym_backup_${timestamp}.sqlite`
  );

  fs.copyFile(databaseFile, backupFile, (err) => {
    if (err) {
      console.error("Error haciendo backup:", err);
    } else {
      console.log("Backup de base de datos creado:", backupFile);
    }
  });
}

function createWindow(basePath) {
  console.log("🪟 Creando ventana Electron...");
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  const htmlPath = path.join(basePath, "front", "dist", "index.html");
  console.log("🧭 Cargando frontend desde:", htmlPath);
  win.loadFile(htmlPath);
}

electronApp.whenReady().then(() => {
  console.log("🚀 Electron app ready");

  const basePath = electronApp.isPackaged
    ? path.join(process.resourcesPath, "app")
    : __dirname;

  const server = express();

  try {
    require(path.join(basePath, "back", "index"))(server);
    console.log("✅ Backend Express cargado");
  } catch (err) {
    console.error("❌ Error al cargar backend:", err);
  }

  server.use(express.static(path.join(basePath, "front", "dist")));

  server.get("*", (req, res) => {
    res.sendFile(path.join(basePath, "front", "dist", "index.html"));
  });

  server.listen(3001, () => {
    console.log("✅ Servidor Express corriendo en http://localhost:3001");
    createWindow(basePath);
  });
});

// Backup cuando la app se cierra
electronApp.on("before-quit", () => {
  console.log("App cerrándose, haciendo backup de base de datos...");
  backupDatabase();
});
