const express = require("express");
const router = express.Router();
const cajaController = require("../controllers/cajaControllers");

router.post("/", cajaController.insertarMovimiento);
router.get("/", cajaController.obtenerMovimientos);

module.exports = router;
