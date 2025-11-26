const express = require("express");
const router = express.Router();
const ContactController = require("../Controller/ContactController");

// FORMULARIO
router.get("/", ContactController.mostrarFormulario);

// PROCESAR FORMULARIO
router.post("/", ContactController.enviarMensaje);

module.exports = router;
