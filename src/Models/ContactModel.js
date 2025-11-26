const { DataTypes } = require("sequelize");
const db = require('./db');

const Contact = db.define("contact", {
    idcontact: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING, allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true // para createdAt y updatedAt
});

module.exports = Contact;
