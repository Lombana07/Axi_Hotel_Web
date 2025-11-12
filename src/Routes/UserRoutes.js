const express = require('express');
const router = express.Router();
const userController = require('../Controller/UserController');

router.get('/register', (req, res) => {
    res.render('Pages/Register', { success: null, error: null });
});

router.get('/login', (req, res) => {
    res.render('Pages/Login', { success: null, error: null });
});


router.post('/register', userController.registrarUsuario);

module.exports = router;


