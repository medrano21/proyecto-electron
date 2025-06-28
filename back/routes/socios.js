const express = require("express");
const router = express.Router();
const {
  obtenerSocios,
  eliminarSocio,
  buscarSocios,
} = require("../controllers/socios");

router.get("/", obtenerSocios);
router.get("/buscar", buscarSocios);
router.delete("/:id", eliminarSocio);

module.exports = router;
