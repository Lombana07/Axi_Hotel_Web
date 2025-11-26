const router = require('express').Router();
const BookingController = require('../Controller/BookingController');

// Middleware para verificar login
function usuarioLogueado(req, res, next) {
    if (!req.session.usuario) return res.redirect('/Login');
    next();
}

// CREAR RESERVA
router.post('/crear', usuarioLogueado, BookingController.crearReserva);

// LISTAR MIS RESERVAS
router.get('/Profile', usuarioLogueado, BookingController.misReservas);

// CANCELAR RESERVA
router.post('/cancel/:id', usuarioLogueado, BookingController.cancelarReserva);

// Pagar reserva (cambiar de posicion)
router.post('/pagar/:id', BookingController.pagarReserva);




module.exports = router;


