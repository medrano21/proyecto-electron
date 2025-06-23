const express = require("express");
const router = express.Router();
const deudaController = require("../controllers/deudasControllers");

router.get("/socios-deudas", deudaController.getSocios);
router.get("/:id", deudaController.getDeudasPorSocio);
router.post("/", deudaController.agregarDeuda);
router.put("/", deudaController.editarDeuda);
router.delete("/:id", deudaController.eliminarDeuda);

module.exports = router;
