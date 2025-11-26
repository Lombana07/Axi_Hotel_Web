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
    if (!habitaciones) return res.send("Habitación no encontrada");
    res.render('Pages/Services', {
        titulo: "Reservar habitación",
        habitaciones: [habitacion]
    });
};

// ============================
// CREAR RESERVA
// ============================
exports.crearReserva = async (req, res) => {
    try {
        const { idhabitacion, fechaEntrada, fechaSalida } = req.body;
        const iduser = req.session.usuario.iduser;
        const hoy = new Date().toISOString().split("T")[0];
        const habitacion = await Habitacion.findByPk(idhabitacion);
        if (!habitacion) {
            return res.render("Pages/Services", {
                habitaciones: [habitacion],
                error: "Habitación no encontrada"
            });
        }
        if (!fechaEntrada || !fechaSalida) {
            return res.render("Pages/Services", {
                habitaciones: [habitacion],
                error: "Debes elegir ambas fechas"
            });
        }
        if (fechaEntrada < hoy) {
            return res.render("Pages/Services", {
                habitaciones: [habitacion],
                error: "La fecha de entrada no puede ser anterior a hoy"
            });
        }
        if (fechaEntrada >= fechaSalida) {
            return res.render("Pages/Services", {
                habitaciones: [habitacion],
                error: "La fecha de salida debe ser posterior a la de entrada"
            });
        }
        const conflicto = await Reserva.findOne({
            where: {
                idhabitacion,
                fechaEntrada: { [Op.lt]: fechaSalida },
                fechaSalida: { [Op.gt]: fechaEntrada }
            }
        });
        if (conflicto) {
            return res.render("Pages/Services", {
                habitaciones: [habitacion],
                error: "⚠ La habitación NO está disponible en esas fechas"
            });
        }
        await Reserva.create({
            iduser,
            idhabitacion,
            fechaEntrada,
            fechaSalida
        });
        return res.render("Pages/Services", {
            habitaciones: [habitacion],
            success: "Reserva creada correctamente"
        });
    } catch (error) {
        console.log(error);
        return res.render("Pages/Services", {
            habitaciones: [],
            error: "Ocurrió un error al crear la reserva"
        });
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
    res.render('Pages/Profile', {
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

// ============================
// PAGAR RESERVA
// ============================

exports.pagarReserva = async (req, res) => {
    try {
        const reserva = await Reserva.findByPk(req.params.id);
        if (!reserva) return res.status(404).send("Reserva no encontrada");
        reserva.estado = "pagada";
        await reserva.save();
        res.redirect('/user/profile'); // donde se ve el dashboard
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al pagar la reserva");
    }
};