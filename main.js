const { app: electronApp, BrowserWindow } = require("electron");
require("dotenv").config();

const path = require("path");
const express = require("express");
const fs = require("fs");
const os = require("os");
const nodemailer = require("nodemailer");

// 🔹 Ruta a la base de datos
const databaseFile = path.join(
  __dirname,
  "back",
  "database",
  "db_powergym.sqlite"
);

// 🔹 Carpeta de backups en el escritorio del usuario
const backupDir = path.join(os.homedir(), "Desktop", "backups");

// Crear carpeta si no existe
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

function enviarBackupPorEmail(backupFilePath, done) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_DEST,
    subject: "📦 Backup PowerGym",
    text: "Adjunto el backup automático de la base de datos.",
    attachments: [
      {
        filename: path.basename(backupFilePath),
        path: backupFilePath,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error al enviar backup:", error);
    } else {
      console.log("✅ Backup enviado por email:", info.response);
    }
    done?.(); // finalizar proceso
  });
}

// 🔹 Función de backup
function backupDatabase(done) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(
    backupDir,
    `db_powergym_backup_${timestamp}.sqlite`
  );

  fs.copyFile(databaseFile, backupFile, (err) => {
    if (err) {
      console.error("❌ Error al crear backup:", err);
      done?.(); // cerramos igual
    } else {
      console.log("✅ Backup creado:", backupFile);

      enviarBackupPorEmail(backupFile, done); // pasamos done al email
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

let yaHizoBackup = false;

electronApp.on("before-quit", (event) => {
  if (yaHizoBackup) return;

  event.preventDefault(); // cancela cierre por ahora
  console.log("🛑 Cerrando app... haciendo backup y enviando por email.");

  backupDatabase(() => {
    yaHizoBackup = true;
    electronApp.quit(); // solo una vez
  });
});
