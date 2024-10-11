const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../api/db'); 
const router = express.Router();


router.post('/usuarios', async (req, res) => {
  const { nombre_usuario, correo, contrasena, telefono, ubicacion, foto_perfil } = req.body;

  try {
    // Verificar si el usuario ya existe
    const [existingUser] = await db.query('SELECT * FROM usuario WHERE correo = ?', [correo]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Convertir la imagen base64 a Buffer, si tiene el prefijo 'data:image/...'
    let imageBuffer = null;
    if (foto_perfil) {
      const base64ImagePattern = /^data:image\/\w+;base64,/;
      if (base64ImagePattern.test(foto_perfil)) {
        const base64Data = foto_perfil.replace(base64ImagePattern, "");
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else {
        imageBuffer = Buffer.from(foto_perfil, 'base64');
      }
    }

    await db.query(
      `INSERT INTO usuario (nombre_usuario, correo, rol, contrasena, telefono, ubicacion, foto_perfil, creado_en) 
       VALUES (?, ?, 'usuario', ?, ?, ?, ?, NOW())`,
      [nombre_usuario, correo, hashedPassword, telefono, ubicacion, imageBuffer]
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
    
    const [users] = await db.query('SELECT * FROM usuario WHERE correo = ?', [correo]);

   
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

router.post('/libros', async (req, res) => {
  const { titulo, autor, descripcion, genero, imagen_libro } = req.body;

  // Log para verificar si los datos llegan al servidor
  console.log('Datos recibidos:', { titulo, autor, descripcion, genero, imagen_libro });

  // Validación de campos requeridos
  if (!titulo || !autor || !descripcion || !genero) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    // Verificar si la imagen viene con el prefijo 'data:image/...'
    let imageBuffer = null;
    if (imagen_libro) {
      // Verificar si la cadena base64 tiene un prefijo
      const base64ImagePattern = /^data:image\/\w+;base64,/;
      if (base64ImagePattern.test(imagen_libro)) {
        // Extraer solo la parte de los datos de la imagen
        const base64Data = imagen_libro.replace(base64ImagePattern, "");
        // Convertir la cadena base64 a un Buffer
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else {
        // Si no tiene el prefijo, asumir que es base64 simple y convertirla directamente
        imageBuffer = Buffer.from(imagen_libro, 'base64');
      }
    }

    await db.query(
      `INSERT INTO libro (titulo, autor, descripcion, genero, imagen_libro) VALUES (?, ?, ?, ?, ?)`,
      [titulo, autor, descripcion, genero, imageBuffer]
    );

    return res.status(201).json({ message: 'Libro agregado exitosamente.' });
  } catch (error) {
    console.error('Error al agregar libro:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

router.get('/libros', async (req, res) => {
  try {
    const [libros] = await db.query('SELECT id_libro,titulo, autor, descripcion, genero, TO_BASE64(imagen_libro) AS imagen_libro_base64 FROM libro');
    
    // Ahora la imagen ya viene en formato base64, solo la asignamos
    return res.status(200).json(libros); 
  } catch (error) {
    console.error('Error al obtener libros:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

router.post('/biblioteca', (req, res) => {
  const { id_usuario, id_libro } = req.body; // Obtén solo los campos necesarios

  const query = `
    INSERT INTO biblioteca_usuario (id_usuario, id_libro, disponible_prestamo, disponible_intercambio)
    VALUES (?, ?, false, false)  -- Establece los valores predeterminados como false
  `;

  db.query(query, [id_usuario, id_libro], (error, results) => {
    if (error) {
      console.error('Error al agregar libro a la biblioteca:', error);
      return res.status(500).json({ message: 'Error al agregar libro a la biblioteca' });
    }
    res.status(201).json({ message: 'Libro agregado a la biblioteca', id_biblioteca: results.insertId });
  });
});

router.get('/libros/:correo', async (req, res) => {
  const correo = req.params.correo;
  console.log(`Recibiendo solicitud para el correo: ${correo}`);

  const query = `
    SELECT 
      libro.titulo, 
      TO_BASE64(libro.imagen_libro) AS imagen_base64, 
      biblioteca_usuario.disponible_prestamo, 
      biblioteca_usuario.disponible_intercambio 
    FROM libro
    JOIN biblioteca_usuario ON libro.id_libro = biblioteca_usuario.id_libro
    JOIN usuario ON biblioteca_usuario.id_usuario = usuario.id_usuario
    WHERE usuario.correo = ?
  `;

  try {
    const [results] = await db.query(query, [correo]);
    console.log('Resultados obtenidos:', results);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ message: 'Error al obtener libros' });
  }
});

router.get('/perfil/:correo', async (req, res) => {
  const correo = req.params.correo;
  console.log(`Recibiendo solicitud de perfil para el correo: ${correo}`);

  const query = `
    SELECT 
      nombre_usuario, 
      correo, 
      telefono, 
      ubicacion, 
      TO_BASE64(foto_perfil) AS foto_perfil_base64 
    FROM usuario 
    WHERE correo = ?
  `;

  try {
    const [results] = await db.query(query, [correo]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Enviar la información del perfil del usuario
    return res.status(200).json(results[0]); 
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    return res.status(500).json({ message: 'Error al obtener el perfil del usuario.' });
  }
});

router.put('/usuarios/correo/:correo', async (req, res) => {
  const { correo } = req.params; // Obtén el correo electrónico de los parámetros de la ruta
  const { nombre_usuario, telefono, ubicacion, foto_perfil } = req.body;

  // Log para verificar si los datos llegan al servidor
  console.log('Datos recibidos para editar perfil:', { nombre_usuario, correo, telefono, ubicacion, foto_perfil });

  try {
    // Validación de campos requeridos
    if (!nombre_usuario || !correo || !telefono || !ubicacion) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el usuario existe
    const [existingUser] = await db.query('SELECT * FROM usuario WHERE correo = ?', [correo]);

    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Convertir la imagen base64 a Buffer, si se proporciona
    let imageBuffer = null;
    if (foto_perfil) {
      const base64ImagePattern = /^data:image\/\w+;base64,/;
      if (base64ImagePattern.test(foto_perfil)) {
        const base64Data = foto_perfil.replace(base64ImagePattern, "");
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else {
        imageBuffer = Buffer.from(foto_perfil, 'base64');
      }
    }

    // Actualizar el usuario en la base de datos
    await db.query(
      `UPDATE usuario 
       SET nombre_usuario = ?, telefono = ?, ubicacion = ?, foto_perfil = ? 
       WHERE correo = ?`,
      [nombre_usuario, telefono, ubicacion, imageBuffer || existingUser[0].foto_perfil, correo] // Mantener la foto existente si no se proporciona una nueva
    );

    return res.status(200).json({ message: 'Perfil actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});





module.exports = router;
