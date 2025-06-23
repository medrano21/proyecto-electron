const express = require("express");
const router = express.Router();
const {
  obtenerPlanes,
  agregarPlan,
  actualizarPlan,
  eliminarPlan,
  getPlanes,
} = require("../controllers/PlanesControllers");

router.get("/", obtenerPlanes);
router.post("/", agregarPlan);
router.put("/:id_plan", actualizarPlan);
router.delete("/:id_plan", eliminarPlan);

module.exports = router;
