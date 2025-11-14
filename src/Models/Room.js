const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Habitacion = sequelize.define('Habitacion', {
    idhabitacion: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    numero: { type: DataTypes.STRING, allowNull: false },       // ej: "101", "A12"
    tipo: { type: DataTypes.STRING, allowNull: false },         // simple, doble, suite
    precio: { type: DataTypes.DECIMAL(10,2), allowNull: false },// por noche
    disponible: { type: DataTypes.BOOLEAN, defaultValue: true }, // disponible o no
    imagen: { type: DataTypes.STRING, allowNull: true }
}, {
    timestamps: true,
    tableName: 'Habitacion'
});

module.exports = Habitacion;

