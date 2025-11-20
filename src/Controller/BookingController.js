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
        const { idhabitacion, fechaEntrada, fechaSalida } = req.body;
        const iduser = req.session.usuario.iduser;
        if (!fechaEntrada || !fechaSalida)
            return res.send("Debes elegir ambas fechas");
        if (fechaEntrada >= fechaSalida)
            return res.send("La fecha de salida debe ser posterior a la de entrada");
        // Validar habitación
        const habitacion = await Habitacion.findByPk(idhabitacion);
        if (!habitacion) return res.send("Habitación no encontrada");
        // Verificar disponibilidad
        const conflicto = await Reserva.findOne({
            where: {
                idhabitacion,
                fechaEntrada: { [Op.lte]: fechaSalida },
                fechaSalida: { [Op.gte]: fechaEntrada }
            }
        });
        if (conflicto)
            return res.send("⚠ La habitación NO está disponible en esas fechas");
        // Crear reserva
        await Reserva.create({
            iduser,
            idhabitacion,
            fechaEntrada,
            fechaSalida
        });
        res.redirect('/user/profile');
    } catch (error) {
        console.log(error);
        res.send("Error al crear la reserva");
    }
};

// ============================
// LISTAR MIS RESERVAS
// ============================
exports.misReservas = async (req, res) => {
    if (!req.session.usuario) return res.redirect('/Login');
    const iduser = req.session.usuario.iduser;
    const reservas = await Reserva.findAll({
        where: { iduser },
        include: [{ model: Habitacion }]
    });
    res.render('Pages/MisReservas', {
        titulo: "Mis Reservas",
        reservas
    });
};

// ============================
// CANCELAR RESERVA
// ============================
exports.cancelarReserva = async (req, res) => {
    try {
        const idreserva = req.params.id;
        const reserva = await Reserva.findByPk(idreserva);
        if (!reserva) return res.send("Reserva no encontrada");
        if (reserva.iduser !== req.session.usuario.iduser)
            return res.send("No puedes cancelar una reserva que no es tuya");
        await reserva.destroy();
        res.redirect('/user/profile');
    } catch (error) {
        console.log(error);
        res.send("Error al cancelar la reserva");
    }
};

