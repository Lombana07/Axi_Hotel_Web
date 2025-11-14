const express = require('express');
const router = express.Router();
const Booking = require('../Models/Booking');
const Room = require('../Models/Room');

// Middleware: solo usuarios logueados pueden reservar
function usuarioLogueado(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect('/Login');
    }
    next();
}

// Procesar reserva
router.post('/crear', usuarioLogueado, async (req, res) => {
    const { roomId, checkIn, checkOut } = req.body;

    try {
        // 1. Verificar si la habitación existe
        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(400).send("Habitación no encontrada");
        }

        // 2. Verificar disponibilidad en esas fechas
        const conflicto = await Booking.findOne({
            where: {
                roomId,
                checkIn: { [require('sequelize').Op.lte]: checkOut },
                checkOut: { [require('sequelize').Op.gte]: checkIn }
            }
        });

        if (conflicto) {
            return res.send("Esta habitación NO está disponible en esas fechas");
        }

        // 3. Crear reserva
        await Booking.create({
            roomId,
            userId: req.session.usuario.iduser,
            checkIn,
            checkOut
        });

        res.redirect('/Services');

    } catch (error) {
        console.error("Error en la reserva:", error);
        res.status(500).send("Error interno al reservar");
    }
});

module.exports = router;
