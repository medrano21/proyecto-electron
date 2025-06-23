const express = require("express");
const router = express.Router();
const {
  getSociosPorSexo,
  getSociosPorPlan,
  getSociosPorMes,
} = require("../controllers/socios");

router.get("/socios-por-sexo", getSociosPorSexo);
router.get("/socios-por-plan", getSociosPorPlan);
router.get("/socios-por-mes", getSociosPorMes);

module.exports = router;
