const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Usuario = require('./User');
const Habitacion = require('./Room');

const Reserva = sequelize.define('Reserva', {
    idreserva: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fechaEntrada: { type: DataTypes.DATEONLY, allowNull: false },
    fechaSalida: { type: DataTypes.DATEONLY, allowNull: false },
    estado: { type: DataTypes.STRING, allowNull: false, defaultValue: "pendiente"}

}, {
    timestamps: true,
    tableName: 'Reserva'
});

// RELACIONES
Usuario.hasMany(Reserva, { foreignKey: 'iduser' });
Reserva.belongsTo(Usuario, { foreignKey: 'iduser' });

Habitacion.hasMany(Reserva, { foreignKey: 'idhabitacion' });
Reserva.belongsTo(Habitacion, { foreignKey: 'idhabitacion' });

module.exports = Reserva;
