const { app: electronApp, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");

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

  // Base path para recursos (diferencia entre dev y prod)
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

  // Servir frontend estático
  server.use(express.static(path.join(basePath, "front", "dist")));

  // Todas las rutas apuntan al index.html para SPA
  server.get("*", (req, res) => {
    res.sendFile(path.join(basePath, "front", "dist", "index.html"));
  });

  // Iniciar servidor
  server.listen(3001, () => {
    console.log("✅ Servidor Express corriendo en http://localhost:3001");
    createWindow(basePath);
  });
});
