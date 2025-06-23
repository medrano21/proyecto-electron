const express = require("express");
const router = express.Router();
const { buscarSocio } = require("../controllers/accesoSocios");

// Esta ruta va a responder en: /api/accesos/buscar
router.post("/buscar", buscarSocio);

module.exports = router;
