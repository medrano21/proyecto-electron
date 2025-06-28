const express = require("express");
const router = express.Router();
const deudaController = require("../controllers/deudasControllers");

router.get("/socios-deudas", deudaController.getSocios);
router.post("/", deudaController.agregarDeuda);
router.put("/", deudaController.editarDeuda);
router.get("/:id", deudaController.getDeudasPorSocio);
router.delete("/:id", deudaController.eliminarDeuda);

module.exports = router;
