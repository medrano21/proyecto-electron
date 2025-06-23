const express = require("express");
const router = express.Router();
const {
  obtenerSocios,
  eliminarSocio,
  buscarSocios,
} = require("../controllers/socios");

router.get("/", obtenerSocios);
router.delete("/:id", eliminarSocio);
router.get("/buscar", buscarSocios);

module.exports = router;
