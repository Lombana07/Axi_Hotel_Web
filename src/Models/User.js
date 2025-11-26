// Models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Usuario = sequelize.define('Usuario', {
    iduser: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    rol: { type: DataTypes.STRING, defaultValue: "user"},
    mail: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: true,      // agrega createdAt y updatedAt automáticamente
    tableName: 'User'      // nombre exacto de la tabla en MySQL
});

module.exports = Usuario;

