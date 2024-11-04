// api/server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userController = require('./controller');
const http = require('http'); // Importa http
const socketIo = require('socket.io'); // Importa Socket.IO

const app = express();
const PORT = process.env.PORT || 3000;

// Crea el servidor HTTP
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:8100', // Cambia esto a la URL de tu aplicación Angular
    methods: ['GET', 'POST'], // Métodos que quieres permitir
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados que quieres permitir
    credentials: true // Permitir credenciales si es necesario
  }
});

// Configuración de CORS para las rutas de Express
app.use(cors({
  origin: [
    'http://localhost:8100',
    'http://192.168.105.79:8100' // Añade tu IP aquí
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos que quieres permitir
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados que quieres permitir
  credentials: true // Permitir credenciales si es necesario
}));

// Middleware
app.use(bodyParser.json()); // Para parsear aplicaciones JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para parsear datos URL-encoded

// Rutas
app.use('/api', userController(io)); // Pasa el objeto io al controlador

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
