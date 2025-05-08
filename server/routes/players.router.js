const express = require('express');
const playersController = require('../controllers/players.controller');
const router = express.Router();

// Ruta para obtener jugadores ordenados por score o nombre
router.get('/players', playersController.getPlayers);

module.exports = router;
