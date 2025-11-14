const express = require('express');
const router = express.Router();
const Room = require('../Models/Room');

// Mostrar lista de habitaciones
router.get('/', async (req, res) => {
    try {
        const habitaciones = await Room.findAll();
        res.render('Pages/Services', { habitaciones });
    } catch (error) {
        console.error("Error al obtener habitaciones:", error);
        res.status(500).send("Error interno del servidor");
    }
});

module.exports = router;
