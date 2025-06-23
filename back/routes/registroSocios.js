const express = require("express");
const router = express.Router();
const { registroSocio } = require("../controllers/registroSocios"); // o './controllers/socios'

router.post("/socios", registroSocio); // ← esta línea debe existir

module.exports = router;
