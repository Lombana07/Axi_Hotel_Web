// Config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Conexión a MySQL con Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false // opcional: oculta los logs SQL en consola
    }
);

// Probar conexión y sincronizar tablas automáticamente
sequelize.authenticate()
    .then(() => console.log('✅ Conexión a la base de datos exitosa'))
    .catch(err => console.error('❌ Error al conectar a la base de datos:', err));

sequelize.sync({ alter: true })
    .then(() => console.log('✅ Tablas sincronizadas correctamente'))
    .catch(err => console.error('❌ Error al sincronizar tablas:', err));

module.exports = sequelize;

