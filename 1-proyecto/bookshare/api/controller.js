const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../api/db');

const router = express.Router();


router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body; // Usa 'contrasena' aquí

  try {
    // Busca el usuario en la base de datos
    const [users] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    // Verifica si se encontró el usuario
    if (!users || users.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    // Extrae el primer usuario encontrado
    const foundUser = users[0];

    // Verifica la contraseña ingresada contra el hash almacenado
    const isValid = await bcrypt.compare(contrasena, foundUser.contrasena); // Usa 'contrasena' aquí

    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    // Genera un token JWT
    const token = jwt.sign({ id: foundUser.id_usuario }, 'clave_unica', { expiresIn: '1h' });


    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id_usuario: foundUser.id_usuario,
        nombre_usuario: foundUser.nombre_usuario,
        correo: foundUser.correo,
        rol: foundUser.rol,
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;
