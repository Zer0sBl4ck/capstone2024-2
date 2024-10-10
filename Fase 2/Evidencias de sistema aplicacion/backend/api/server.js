// api/server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userController = require('./controller');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permite CORS para todas las solicitudes
app.use(bodyParser.json()); // Para parsear aplicaciones JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para parsear datos URL-encoded

// Rutas
app.use('/api', userController); // Conecta el controlador de usuarios a la ruta /api

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});