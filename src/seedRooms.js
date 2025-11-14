const Room = require('./Models/Room');
const sequelize = require('./Models/db');

async function seedRooms() {
    await sequelize.sync({ force: false });
    await Room.bulkCreate([
        {
            numero: "101",
            tipo: "Suite",
            precio: 350000,
            disponible: true,
            imagen: "Deluxe.jpg"
        },
        {
            numero: "102",
            tipo: "Doble",
            precio: 180000,
            disponible: true,
            imagen: "Double.jpg"
        },
        {
            numero: "103",
            tipo: "Sencilla",
            precio: 120000,
            disponible: false,
            imagen: "simple.jpg"
        }
    ]);
}


seedRooms();