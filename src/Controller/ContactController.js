const Contact = require("../Models/ContactModel");

exports.mostrarFormulario = (req, res) => {
    res.render("Pages/Contact", { titulo: "Contáctanos" });
};

exports.enviarMensaje = async (req, res) => {
    try {
        const { nombre, email, mensaje } = req.body;
        if (!nombre || !email || !mensaje) {
            return res.render("Pages/Contact", {
                error: "Todos los campos son obligatorios"
            });
        }
        await Contact.create({
            nombre,
            email,
            mensaje
        });
        return res.render("Pages/Contact", {
            success: "Mensaje enviado correctamente. ¡Gracias por contactarnos!"
        });
    } catch (error) {
        console.log(error);
        res.render("Pages/Contact", {
            error: "Ocurrió un error al enviar tu mensaje."
        });
    }
};
