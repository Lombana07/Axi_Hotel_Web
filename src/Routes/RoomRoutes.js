const express = require('express');
const router = express.Router();
const RoomController = require('../Controller/RoomController');

// Mostrar lista de habitaciones
router.get('/', RoomController.listarHabitaciones);

module.exports = router;
