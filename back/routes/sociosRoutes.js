const express = require("express");
const router = express.Router();
const { getSociosByEstado } = require("../controllers/socios");

router.get("/", getSociosByEstado);

module.exports = router;
