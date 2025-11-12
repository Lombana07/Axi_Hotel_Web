const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const sequelize = require('./src/Models/db'); //  Importación correcta
const Usuario = require('./src/Models/User'); // Importar el modelo

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/Public')));

app.use((req, res, next) => {
    res.locals.mensaje = null;
    res.locals.tipoMensaje = null;
    next();
});

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'View'));
app.use(expressLayouts);
app.set('layout', 'Layouts/Main');

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../Public')));
app.use(express.static('Public'));

// Conexión y sincronización con la base de datos
sequelize.sync({ force: false })
    .then(() => console.log('🟢 Base de datos sincronizada correctamente'))
    .catch(err => console.error('🔴 Error al conectar la base de datos:', err));

// Rutas
app.get('/', (req, res) => res.render('Pages/Index', { titulo: 'Inicio' }));
app.get('/AboutUs', (req, res) => res.render('Pages/AboutUs', { titulo: 'Nosotros' }));
app.get('/Services', (req, res) => res.render('Pages/Services', { titulo: 'Servicios' }));
app.get('/Contact', (req, res) => res.render('Pages/Contact', { titulo: 'Contáctenos' }));
app.get('/Login', (req, res) => res.render('Pages/Login', { titulo: 'Inicia sesión' }));
app.get('/Register', (req, res) => res.render('Pages/Register', { titulo: 'Registrate' }));

//importando rutas
const userRoutes = require('./src/Routes/UserRoutes');
app.use('/user', userRoutes);

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));

