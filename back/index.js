const express = require("express");
const cors = require("cors");
const path = require("path");

const usuariosRoutes = require("./routes/usuarios");
const sociosRoutes = require("./routes/registroSocios");
const registroCobrosRoutes = require("./routes/registroCobros");
const accesoSociosRoutes = require("./routes/accesoSocios");
const planesRoutes = require("./routes/planesRoutes");
const socios = require("./routes/socios");
const historialRoutes = require("./routes/historialRoutes");
const deudasRoutes = require("./routes/deudasRoutes");
const estadisticasRoutes = require("./routes/estadisticas");
const estadoSocios = require("./routes/sociosRoutes");
const cajaRoutes = require("./routes/cajaRoutes");

module.exports = (app) => {
  app.use(cors());
  app.use(express.json());

  // Tus rutas:
  app.use("/api", usuariosRoutes);
  app.use("/api", sociosRoutes);
  app.use("/api", registroCobrosRoutes);
  app.use("/api/accesos", accesoSociosRoutes);
  app.use("/api/planes", planesRoutes);
  app.use("/api/socios", socios);
  app.use("/api/historial", historialRoutes);
  app.use("/api/deudas", deudasRoutes);
  app.use("/api/estadisticas", estadisticasRoutes);
  app.use("/api/estado_socios", estadoSocios);
  app.use("/api/caja", cajaRoutes);
};
