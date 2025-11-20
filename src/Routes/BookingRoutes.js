const router = require('express').Router();
const BookingController = require('../Controller/BookingController');

// Middleware para verificar login
function usuarioLogueado(req, res, next) {
    if (!req.session.usuario) return res.redirect('/Login');
    next();
}

// FORMULARIO PARA RESERVAR
router.get('/reservar/:id', usuarioLogueado, BookingController.formularioReserva);

// CREAR RESERVA
router.post('/crear', usuarioLogueado, BookingController.crearReserva);

// LISTAR MIS RESERVAS
router.get('/mis-reservas', usuarioLogueado, BookingController.misReservas);

// CANCELAR RESERVA
router.post('/cancel/:id', usuarioLogueado, BookingController.cancelarReserva);

module.exports = router;


