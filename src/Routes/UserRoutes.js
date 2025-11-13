const express = require('express');
const router = express.Router();
const userController = require('../Controller/UserController');

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
//  Procesar login
router.post('/login', userController.iniciarSesion);
//procesar cerrar sesion
router.get('/logout', userController.cerrarSesion);

// Perfil del usuario
router.get('/profile', (req, res) => {
    if (!req.session.usuario) {
    return res.redirect('/Login'); // Si no hay sesión, redirige al login
    }
    res.render('Pages/Profile', { titulo: 'Mi Perfil', usuario: req.session.usuario });
});

module.exports = router;


