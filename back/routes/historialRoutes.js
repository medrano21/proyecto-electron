const express = require("express");
const router = express.Router();
const {
  obtenerHistorial,
  filtrarPorMesAnio,
  filtrarPorDia,
} = require("../controllers/historialController");

router.get("/", obtenerHistorial);
router.get("/mes-anio", filtrarPorMesAnio);
router.get("/dia", filtrarPorDia);

module.exports = router;
