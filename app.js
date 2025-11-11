const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/Public')));

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'View'));
app.use(expressLayouts);
app.set('layout', 'Layouts/Main');

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../Public')));
app.use(express.static('Public'));


// Rutas
app.get('/', (req, res) => res.render('Pages/Index', { titulo: 'Inicio' }));
app.get('/AboutUs', (req, res) => res.render('Pages/AboutUs', { titulo: 'Nosotros' }));
app.get('/Services', (req, res) => res.render('Pages/Services', { titulo: 'Servicios' }));
app.get('/Contact', (req, res) => res.render('Pages/Contact', { titulo: 'Contáctenos' }));
app.get('/Login', (req, res) => res.render('Pages/Login', { titulo: 'Inicia sesión' }));
app.get('/Register', (req, res) => res.render('Pages/Register', { titulo: 'Registrate' }));

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));

