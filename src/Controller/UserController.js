const Usuario = require('../Models/User');

exports.registrarUsuario = async (req, res) => {
    try {
    const { name, lastname, address, mail, password } = req.body;

    await Usuario.create({ name, lastname, address, mail, password });

    // Renderiza con variable "success"
    res.render('Pages/Register', { 
        success: 'Usuario registrado exitosamente ✅'
    });

    } catch (error) {
    console.error('Error al registrar usuario:', error);

    let msg = 'Hubo un error al registrar el usuario ❌';
    if (error.name === 'SequelizeUniqueConstraintError') {
        msg = 'Este correo ya está registrado.';
    }

    res.render('Pages/Register', { 
        error: msg
    });
    }
};


