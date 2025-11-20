const express = require('express');
const router = express.Router();
const userController = require('../Controller/UserController');

// MODELOS QUE NECESITAMOS PARA TRAER LAS RESERVAS
const Reserva = require('../Models/Booking');
const Room = require('../Models/Room');

// Middleware para verificar sesión
function auth(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect('/user/Login');
    }
    next();
}

// Mostrar formulario de registro
router.get('/register', (req, res) => {
    res.render('Pages/Register', { success: null, error: null });
});

// Mostrar formulario de login
router.get('/login', (req, res) => {
    res.render('Pages/Login', { success: null, error: null });
});

// Procesar registro
router.post('/register', userController.registrarUsuario);

// Procesar login
router.post('/login', userController.iniciarSesion);

// Procesar cerrar sesión
router.get('/logout', userController.cerrarSesion);

// 📌 PERFIL DEL USUARIO (+ RESERVAS)
router.get('/profile', auth, async (req, res) => {
    try {
        const reservas = await Reserva.findAll({
            where: { iduser: req.session.usuario.iduser },
            include: [{ model: Room }]  // ← para mostrar datos de la habitación
        });

        res.render('Pages/Profile', { 
            titulo: 'Mi Perfil', 
            usuario: req.session.usuario, 
            reservas: reservas  // ← 🔥 IMPORTANTE
        });

    } catch (error) {
        console.error("Error cargando reservas:", error);
        res.render('Pages/Profile', { 
            titulo: 'Mi Perfil', 
            usuario: req.session.usuario, 
            reservas: [] 
        });
    }
});

module.exports = router;



