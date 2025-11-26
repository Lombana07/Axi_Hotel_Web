const Usuario = require('../Models/User');
const Reserva = require('../Models/Booking');
const Habitacion = require('../Models/Room');
const Contacto = require("../Models/ContactModel");
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { Op } = require("sequelize"); // Asegúrate de tener esto arriba

exports.miPerfil = async (req, res) => {
    try {
        const user = req.session.usuario;
        const hoy = new Date().toISOString().split("T")[0];
        // 1. Actualizar automáticamente reservas que ya terminaron
        await Reserva.update(
            { estado: "finalizada" },
            {
                where: {
                    iduser: user.iduser,
                    estado: "pagada", 
                    fechaEntrada: { [Op.lt]: hoy },
                    estado: { [Op.ne]: "finalizada" }
                }
            }
        );
        // 2. Consultar las reservas según el estado actualizado
        const pendientes = await Reserva.findAll({
            where: { iduser: user.iduser, estado: "pendiente" },
            include: [{ model: Habitacion }]
        });
        const pagadas = await Reserva.findAll({
            where: { iduser: user.iduser, estado: "pagada" },
            include: [{ model: Habitacion }]
        });
        const historial = await Reserva.findAll({
            where: { iduser: user.iduser, estado: "finalizada" },
            include: [{ model: Habitacion }]
        });
        // 3. Renderizar la vista
        res.render("Pages/Profile", {
            titulo: "Mi Perfil",
            usuario: user,
            pendientes,
            pagadas,
            historial
        });
    } catch (error) {
        console.error("Error cargando perfil:", error);
        res.status(500).send("Error interno del servidor");
    }
};

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
        // Buscar usuario por correo
        const usuario = await Usuario.findOne({ where: { mail } });
        if (!usuario) {
            return res.render('Pages/Login', { error: 'Correo no registrado.' });
        }
        // Validación de contraseña
        if (usuario.password !== password) {
            return res.render('Pages/Login', { error: 'Contraseña incorrecta.' });
        }
        // Guardar usuario en sesión
        req.session.usuario = {
            iduser: usuario.iduser,
            name: usuario.name,
            mail: usuario.mail,
            rol: usuario.rol   // <-- IMPORTANTE
        };
        // Redirección según rol
        if (usuario.rol === "admin") {
            return res.redirect("/user/admin");  // <-- Ruta del admin
        } else {
            return res.redirect("/"); // <-- ruta normal para usuarios comunes
        }
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

exports.vistaAdmin = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        const reservas = await Reserva.findAll();
        const contactos = await Contacto.findAll();
        res.render("Pages/Admin", {
            usuarios,
            reservas,
            contactos
        });
    } catch (error) {
        console.error("Error cargando admin:", error);
        res.send("Error cargando la página del administrador.");
    }
};


exports.enviarReporte = async (req, res) => {
    try {
        const { nombreArchivo, contenido, email } = req.body;
        console.log("📥 BODY RECIBIDO:", req.body);

        // Carpeta y archivo
        const rutaCarpeta = path.join(__dirname, "..", "Reportes");
        const rutaArchivo = path.join(rutaCarpeta, nombreArchivo);  // ✔️ CORREGIDO

        if (!fs.existsSync(rutaCarpeta)) {
            fs.mkdirSync(rutaCarpeta);
        }

        fs.writeFileSync(rutaArchivo, contenido);
        console.log("📝 Archivo creado en:", rutaArchivo);

        // Configurar correo
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "davidlombanayepes@gmail.com",
                pass: "zcmmuccmpfojeanv"
            }
        });

        console.log("⚡ Intentando enviar correo...");

        await transporter.sendMail({
            from: "📊 AXI HOTEL Reportes",
            to: email, // ✔️ CORRECTO
            subject: "Reporte del sistema",
            text: "Adjunto archivo solicitado.",
            attachments: [
                {
                    filename: nombreArchivo,
                    path: rutaArchivo
                }
            ]
        });
        console.log("📨 Correo enviado!");
        return res.json({ mensaje: "Reporte enviado al correo correctamente." });
    } catch (error) {
        console.log("❌ ERROR:", error);
        return res.status(500).json({ mensaje: "Error al enviar reporte." });
    }
};


