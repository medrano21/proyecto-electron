const express = require('express');
const router = express.Router();
const { obtenerRegistroCobros,registrarCobro } = require('../controllers/registroCobros');

router.get('/cobros', obtenerRegistroCobros);
router.post('/cobros', registrarCobro);

module.exports = router;

