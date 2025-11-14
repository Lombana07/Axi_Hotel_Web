const Usuario = require('../Models/User');

exports.registrarUsuario = async (req, res) => {
    try {
    const { name, lastname, address, mail, password } = req.body;
    // 🔹 Validaciones básicas
    if (!name || !lastname || !address || !mail || !password) {
        return res.render('Pages/Register', { error: 'Todos los campos son obligatorios.' });
    }
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoValido.test(mail)) {
        return res.render('Pages/Register', { error: 'El correo ingresado no es válido.' });
    }
    if (password.length < 6) {
        return res.render('Pages/Register', { error: 'La contraseña debe tener al menos 6 caracteres.' });
    }
    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findOne({ where: { mail } });
    if (usuarioExistente) {
        return res.render('Pages/Register', { error: 'El correo ya está registrado. Intenta con otro.' });
    }
    // Crear nuevo usuario
    await Usuario.create({ name, lastname, address, mail, password });
    // Mostrar alerta y redirigir
    res.render('Pages/Register', { success: 'Usuario registrado exitosamente ✅' });

    } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.render('Pages/Register', { error: 'Hubo un error al registrar el usuario ❌' });
    }
};

exports.iniciarSesion = async (req, res) => {
    const { mail, password } = req.body;
    try {
    const usuario = await Usuario.findOne({ where: { mail } });
    if (!usuario) {
        return res.render('Pages/Login', { error: 'Correo no registrado.' });
    }
    if (usuario.password !== password) {
        return res.render('Pages/Login', { error: 'Contraseña incorrecta.' });
    }
    // Guardar usuario en la sesión
    req.session.usuario = {
        iduser: usuario.iduser,
        name: usuario.name,
        mail: usuario.mail
    };
    // Redirigir al inicio o página protegida
    res.redirect('/');

    } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.render('Pages/Login', { error: 'Error interno al intentar iniciar sesión.' });
    }
};

exports.cerrarSesion = (req, res) => {
    req.session.destroy(err => {
    if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.redirect('/');
    }
    res.redirect('/Login'); // 🔹 Redirige a la página de login
    });
};



