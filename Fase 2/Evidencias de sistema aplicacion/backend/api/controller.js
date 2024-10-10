const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../api/db'); 

const router = express.Router();


router.post('/usuarios', async (req, res) => {
  const { nombre_usuario, correo, contrasena, ubicacion } = req.body;

  try {
    
    const [existingUser] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    
    const hashedPassword = await bcrypt.hash(contrasena, 10);

 
    await db.query(
      `INSERT INTO usuarios (nombre_usuario, correo, contrasena, rol, ubicacion, creado_en, reputacion) 
       VALUES (?, ?, ?, 'normal', ?, NOW(), 0)`,
      [nombre_usuario, correo, hashedPassword, ubicacion]
    );

    return res.status(201).json({ message: 'Usuario creado exitosamente.' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    
    const [users] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

   
    if (!users || users.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    
    const foundUser = users[0];

    
    const isValid = await bcrypt.compare(contrasena, foundUser.contrasena);

    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    
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
