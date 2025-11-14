const Reserva = require('../Models/Booking');
const Habitacion = require('../Models/Room');
const Usuario = require('../Models/User');
const { Op } = require("sequelize");

// ============================
// FORMULARIO PARA RESERVAR
// ============================
exports.formularioReserva = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/Login');
    const habitacion = await Habitacion.findByPk(req.params.id);
    if (!habitacion) return res.send("Habitación no encontrada");
    res.render('Pages/Reservar', {
        titulo: "Reservar habitación",
        habitacion
    });
};

// ============================
// CREAR RESERVA
// ============================
exports.crearReserva = async (req, res) => {
    try {
        if (!req.session.usuario) return res.redirect('/Login');
        const idhabitacion = req.params.id;       // viene de la URL
        const iduser = req.session.usuario.iduser;
        const { fechaEntrada, fechaSalida } = req.body;
        // Validación básica
        if (!fechaEntrada || !fechaSalida) {
            return res.send("Debes elegir ambas fechas.");
        }
        if (fechaEntrada >= fechaSalida) {
            return res.send("La fecha de salida debe ser posterior a la de entrada");
        }
        // Verificar si la habitación existe
        const habitacionExiste = await Habitacion.findByPk(idhabitacion);
        if (!habitacionExiste) return res.send("La habitación no existe.");
        // COMPROBAR DISPONIBILIDAD
        const choque = await Reserva.findOne({
            where: {
                idhabitacion,
                fechaEntrada: { [Op.lte]: fechaSalida },
                fechaSalida: { [Op.gte]: fechaEntrada }
            }
        });
        if (choque) {
            return res.send("⚠ La habitación NO está disponible en esas fechas.");
        }
        // Crear la reserva
        await Reserva.create({
            iduser,
            idhabitacion,
            fechaEntrada,
            fechaSalida
        });
        res.redirect('/reservas/mis-reservas');
    } catch (error) {
        console.log(error);
        res.send("Error al crear la reserva");
    }
};

// ============================
// MIS RESERVAS
// ============================
exports.misReservas = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/Login');
    const iduser = req.session.usuario.iduser;
    const reservas = await Reserva.findAll({
        where: { iduser },
        include: [
            { model: Habitacion }
        ]
    });
    res.render('Pages/MisReservas', {
        titulo: "Mis Reservas",
        reservas
    });
};
