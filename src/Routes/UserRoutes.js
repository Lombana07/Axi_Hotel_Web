const express = require('express');
const router = express.Router();
const userController = require('../Controller/UserController');

// Middleware para verificar sesión
function auth(req, res, next) {
    if (!req.session.usuario) return res.redirect('/user/Login');
    next();
}
// Middleware para verificar rol admin
function isAdmin(req, res, next) {
    if (req.session.usuario && req.session.usuario.rol === "admin") {
        return next();
    }
    return res.redirect('/user/login');
}
// Formularios
router.get('/register', (req, res) => res.render('Pages/Register'));
router.get('/login', (req, res) => res.render('Pages/Login'));

// Procesos
router.post('/register', userController.registrarUsuario);
router.post('/login', userController.iniciarSesion);
router.get('/logout', userController.cerrarSesion);

// Perfil (con reservas)
router.get('/profile', auth, userController.miPerfil);

//  PANEL ADMIN (protegido)
router.get('/admin', auth, isAdmin, userController.vistaAdmin);

router.post('/admin/enviar-txt', userController.enviarReporte);

module.exports = router;




