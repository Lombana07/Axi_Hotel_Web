const Reserva = require('../Models/Booking');
const Habitacion = require('../Models/Room');
const Usuario = require('../Models/User');
const { Op } = require("sequelize");

exports.listarHabitaciones = async (req, res) => {
    try {
        const habitaciones = await Habitacion.findAll();
        res.render('Pages/Services', { 
            titulo: 'Servicios',
            habitaciones
        });
    } catch (error) {
        console.error("Error al obtener habitaciones:", error);
        res.status(500).send("Error interno del servidor");
    }
};