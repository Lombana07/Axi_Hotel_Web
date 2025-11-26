const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session'); 
const sequelize = require('./src/Models/db');
const Usuario = require('./src/Models/User');
const Room = require('./src/Models/Room'); // ← IMPORTANTE
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // ← AGREGAR ESTO
app.use(express.static(path.join(__dirname, '../Public')));
app.use(express.static('Public'));

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'View'));
app.use(expressLayouts);
app.set('layout', 'Layouts/Main');

// Configuración de Sesiones
app.use(
    session({
        secret: 'Lombana-_-07',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
    })
);
// Middleware global para EJS
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null; 
    next();
});
// Conexión BD
sequelize.sync()
    .then(() => console.log('🟢 Base de datos sincronizada correctamente'))
    .catch(err => console.error('🔴 Error al conectar la base de datos:', err));

// Rutas base
app.get('/Services', (req, res) => res.redirect('/rooms'));
app.get('/', (req, res) => res.render('Pages/Index', { titulo: 'Inicio' }));
app.get('/AboutUs', (req, res) => res.render('Pages/AboutUs', { titulo: 'Nosotros' }));
app.get('/Contact', (req, res) => res.render('Pages/Contact', { titulo: 'Contáctenos' }));
app.get('/Login', (req, res) => res.render('Pages/Login', { titulo: 'Inicia sesión' }));
app.get('/Register', (req, res) => res.render('Pages/Register', { titulo: 'Regístrate' }));

// Importando rutas
const userRoutes = require('./src/Routes/UserRoutes');
const roomRoutes = require('./src/Routes/RoomRoutes');
const bookingRoutes = require('./src/Routes/BookingRoutes');
const contactRoutes = require("./src/Routes/ContactRoutes");

app.use('/user', userRoutes);
app.use("/contact", contactRoutes);
app.use('/rooms', roomRoutes);
app.use('/bookings', bookingRoutes);

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));


