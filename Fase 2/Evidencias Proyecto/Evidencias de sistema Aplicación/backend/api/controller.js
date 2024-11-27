const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../api/db'); 
const router = express.Router();

module.exports = (io) => {
  // Manejo del evento de conexión de Socket.IO
  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Escucha el evento 'nuevo-mensaje' de los clientes
    socket.on('nuevo-mensaje', (mensaje) => {
      io.emit('nuevo-mensaje', mensaje); // Emite el nuevo mensaje a todos los clientes
    });

    // Manejo de desconexión
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  });




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
    // Buscar al usuario en la base de datos por correo
    const [users] = await db.query('SELECT * FROM usuario WHERE correo = ?', [correo]);

    // Si no se encuentra el usuario
    if (!users || users.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const foundUser = users[0];

    // Verificar si el usuario está suspendido
    if (foundUser.fecha_suspension && new Date(foundUser.fecha_suspension) > new Date()) {
      return res.status(403).json({ message: `Tu cuenta está suspendida hasta el ${foundUser.fecha_suspension}. Por acomulación de reportes.` });
    }

    // Comparar la contraseña ingresada con la contraseña almacenada
    const isValid = await bcrypt.compare(contrasena, foundUser.contrasena);

    // Si la contraseña es incorrecta
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    // Crear el token de autenticación
    const token = jwt.sign({ id: foundUser.id_usuario }, 'clave_unica', { expiresIn: '1h' });

    // Responder con éxito y los datos del usuario
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
  const { isbn, titulo, autor, descripcion, genero, imagen_libro } = req.body; // Eliminamos nuevo_campo

  console.log('Datos recibidos:', { isbn, titulo, autor, descripcion, genero, imagen_libro });

  if (!isbn || !titulo || !autor || !descripcion || !genero) { // Verifica que todos los campos obligatorios estén presentes
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    let imageBuffer = null;
    if (imagen_libro) {
      const base64ImagePattern = /^data:image\/\w+;base64,/;
      if (base64ImagePattern.test(imagen_libro)) {
        const base64Data = imagen_libro.replace(base64ImagePattern, "");
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else {
        imageBuffer = Buffer.from(imagen_libro, 'base64');
      }
    }

    await db.query(
      `INSERT INTO libro (isbn, titulo, autor, descripcion, genero, imagen_libro, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
      [isbn, titulo, autor, descripcion, genero, imageBuffer, true] // Aquí se establece estado en true
    );

    return res.status(201).json({ message: 'Libro agregado exitosamente.' });
  } catch (error) {
    console.error('Error al agregar libro:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});


router.get('/libros', async (req, res) => {
  try {
    const [libros] = await db.query('SELECT isbn, titulo, autor, descripcion, genero, TO_BASE64(imagen_libro) AS imagen_libro_base64 FROM libro WHERE estado=1'); // Cambia id_libro por isbn
    
    return res.status(200).json(libros);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

router.post('/biblioteca', (req, res) => {
  const { id_usuario, isbn } = req.body;

  const query = `
    INSERT INTO biblioteca_usuario (id_usuario, isbn, disponible_prestamo, disponible_intercambio)
    VALUES (?, ?, false, false)
  `;

  db.query(query, [id_usuario, isbn], (error, results) => {
    if (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.warn('Intento de insertar libro duplicado en la biblioteca:', error);
        return res.status(409).json({ message: 'Este libro ya existe en la biblioteca del usuario.' });
      } else {
        console.error('Error al agregar libro a la biblioteca:', error);
        return res.status(500).json({ message: 'Error al agregar libro a la biblioteca.' });
      }
    }

    res.status(201).json({ message: 'Libro agregado a la biblioteca', id_biblioteca: results.insertId });
  });
});

// Middleware global de manejo de errores
process.on('uncaughtException', (err) => {
  console.error('Excepción no capturada:', err);
  // No cerrar el servidor, pero loguea el error
  // Puedes también enviar una respuesta al cliente si lo deseas
});

process.on('unhandledRejection', (err) => {
  console.error('Promesa no manejada:', err);
  // No cerrar el servidor, pero loguea el error
});


router.get('/libros/:correo', async (req, res) => {
  const correo = req.params.correo;
  console.log(`Recibiendo solicitud para el correo: ${correo}`);

  const query = `
    SELECT 
      libro.isbn, 
      libro.titulo, 
      TO_BASE64(libro.imagen_libro) AS imagen_base64, 
      biblioteca_usuario.disponible_prestamo, 
      biblioteca_usuario.disponible_intercambio
    FROM libro
    JOIN biblioteca_usuario ON libro.isbn = biblioteca_usuario.isbn -- Cambia id_libro por isbn
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
      id_usuario,
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
router.post('/resenas-solicitante', async (req, res) => {
  const { id_prestamo, calificacion, comentario } = req.body;

  if (!id_prestamo || !calificacion || comentario === undefined) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  const creado_en = new Date();

  try {
    // Obtener el id_usuario del solicitante a partir del id_prestamo
    const [solicitante] = await db.query(
      'SELECT id_usuario_solicitante FROM prestamo WHERE id_prestamo = ?',
      [id_prestamo]
    );

    if (solicitante.length === 0) {
      return res.status(404).json({ message: 'No se encontró el solicitante para el préstamo proporcionado' });
    }

    const id_usuario = solicitante[0].id_usuario_solicitante;

    // Insertar la reseña
    const [result] = await db.query(
      'INSERT INTO resena (id_usuario, calificacion, comentario, creado_en) VALUES (?, ?, ?, ?)',
      [id_usuario, calificacion, comentario, creado_en]
    );

    // Actualizar el estado de la solicitud
    await db.query(
      'UPDATE prestamo SET estado_prestamo = "Reseña Agregada" WHERE id_prestamo = ?',
      [id_prestamo]
    );

    return res.status(201).json({ message: 'Reseña agregada exitosamente', id_resena: result.insertId });
  } catch (error) {
    console.error('Error al agregar la reseña:', error);
    return res.status(500).json({ message: 'Error al agregar la reseña' });
  }
});
// Endpoint para agregar una reseña del prestamista
// Endpoint para agregar una reseña del prestamista
router.post('/resenas-prestamista', async (req, res) => {
  const { id_prestamo, calificacion, comentario } = req.body;

  if (!id_prestamo || !calificacion || comentario === undefined) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  const creado_en = new Date();

  try {
    // Obtener el id_usuario del prestamista a partir del id_prestamo
    const [prestamista] = await db.query(
      'SELECT id_usuario_prestamista FROM prestamo WHERE id_prestamo = ?',
      [id_prestamo]
    );

    if (prestamista.length === 0) {
      return res.status(404).json({ message: 'No se encontró el prestamista para el préstamo proporcionado' });
    }

    const id_usuario = prestamista[0].id_usuario_prestamista;

    // Insertar la reseña
    const [result] = await db.query(
      'INSERT INTO resena (id_usuario, calificacion, comentario, creado_en) VALUES (?, ?, ?, ?)',
      [id_usuario, calificacion, comentario, creado_en]
    );

    // Actualizar el estado de la solicitud
    await db.query(
      'UPDATE prestamo SET estado_prestamo = "Reseña Agregada" WHERE id_prestamo = ?',
      [id_prestamo]
    );

    return res.status(201).json({ message: 'Reseña del prestamista agregada exitosamente', id_resena: result.insertId });
  } catch (error) {
    console.error('Error al agregar la reseña del prestamista:', error);
    return res.status(500).json({ message: 'Error al agregar la reseña del prestamista' });
  }
});

router.get('/resenas1', async (req, res) => {
  try {
    const [resenas] = await db.query(`
      SELECT r.id_resena, r.isbn, r.calificacion, r.comentario, r.creado_en, 
             u.nombre_usuario AS nombreUsuario, u.foto_perfil AS imagenUsuario, 
             l.titulo, l.autor
      FROM resena r
      JOIN usuario u ON r.id_usuario = u.id_usuario
      JOIN libro l ON r.isbn = l.isbn
      ORDER BY r.creado_en DESC
    `);

    // Procesar la imagen de usuario si está presente
    const resenasConImagen = resenas.map(resena => {
      if (resena.imagenUsuario) {
        resena.imagenUsuario = resena.imagenUsuario.toString('base64');
      }
      return resena;
    });

    return res.status(200).json(resenasConImagen);
  } catch (error) {
    console.error('Error al obtener las reseñas:', error);
    return res.status(500).json({ message: 'Error al obtener las reseñas' });
  }
});
// Ruta para agregar una nueva reseña
// Ruta para agregar una nueva reseña
router.post('/resenas-usuario', async (req, res) => {
  const { userEmail } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT r.id_resena, r.isbn, r.calificacion, r.comentario, r.creado_en, u.nombre_usuario, u.foto_perfil, l.titulo, l.autor
       FROM resena r
       JOIN usuario u ON r.id_usuario = u.id_usuario
       JOIN libro l ON r.isbn = l.isbn
       WHERE u.correo = ?`,
      [userEmail]
    );

    const resenas = rows.map(row => ({
      id_resena: row.id_resena,
      isbn: row.isbn,
      calificacion: row.calificacion,
      comentario: row.comentario,
      creado_en: row.creado_en,
      nombreUsuario: row.nombre_usuario,
      imagenUsuario: row.foto_perfil ? `data:image/jpeg;base64,${row.foto_perfil.toString('base64')}` : 'assets/imagenes/default-avatar.png',
      titulo: row.titulo,
      autor: row.autor
    }));

    return res.status(200).json(resenas);
  } catch (error) {
    console.error('Error al obtener las reseñas del usuario:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});
router.get('/resenas', async (req, res) => {
  const { userEmail } = req.query;

  try {
    const [rows] = await db.query(
      `SELECT r.id_resena, r.isbn, r.calificacion, r.comentario, r.creado_en, u.nombre_usuario, u.foto_perfil, l.titulo, l.autor
       FROM resenas r
       JOIN usuario u ON r.id_usuario = u.id_usuario
       JOIN libros l ON r.isbn = l.isbn
       WHERE u.correo = ?`,
      [userEmail]
    );

    const resenas = rows.map(row => ({
      id_resena: row.id_resena,
      isbn: row.isbn,
      calificacion: row.calificacion,
      comentario: row.comentario,
      creado_en: row.creado_en,
      nombreUsuario: row.nombre_usuario,
      imagenUsuario: row.foto_perfil ? `data:image/jpeg;base64,${row.foto_perfil.toString('base64')}` : 'assets/imagenes/default-avatar.png',
      titulo: row.titulo,
      autor: row.autor
    }));

    return res.status(200).json(resenas);
  } catch (error) {
    console.error('Error al obtener las reseñas del usuario:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});
router.post('/resenas', async (req, res) => {
  const { id_usuario, isbn, calificacion, comentario } = req.body;

  if (!id_usuario || !isbn || !calificacion || comentario === undefined) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  const creado_en = new Date();

  try {
    const [result] = await db.query(
      'INSERT INTO resena (id_usuario, isbn, calificacion, comentario, creado_en) VALUES (?, ?, ?, ?, ?)',
      [id_usuario, isbn, calificacion, comentario, creado_en]
    );

    return res.status(201).json({ message: 'Reseña agregada exitosamente', id_resena: result.insertId });
  } catch (error) {
    console.error('Error al agregar la reseña:', error);
    return res.status(500).json({ message: 'Error al agregar la reseña' });
  }
});
// Ruta para obtener todas las reseñas de un libro por ISBN
router.get('/resenas/:isbn', async (req, res) => {
  const { isbn } = req.params;

  try {
    const [results] = await db.query(
      'SELECT * FROM resena WHERE isbn = ? ORDER BY creado_en DESC',
      [isbn]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron reseñas para este libro.' });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener las reseñas:', error);
    return res.status(500).json({ message: 'Error al obtener las reseñas' });
  }
});


router.post('/libros/estado-false', async (req, res) => {
  const { isbn, titulo, autor, descripcion, genero, imagen_libro } = req.body; // Obtén los datos necesarios

  console.log('Datos recibidos:', { isbn, titulo, autor, descripcion, genero, imagen_libro });

  if (!isbn || !titulo || !autor || !descripcion || !genero) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    let imageBuffer = null;
    // Si hay imagen, convierte de base64 a buffer
    if (imagen_libro) {
      const base64ImagePattern = /^data:image\/\w+;base64,/;
      if (base64ImagePattern.test(imagen_libro)) {
        const base64Data = imagen_libro.replace(base64ImagePattern, "");
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else {
        imageBuffer = Buffer.from(imagen_libro, 'base64');
      }
    }

    // Inserta el libro con estado false
    await db.query(
      `INSERT INTO libro (isbn, titulo, autor, descripcion, genero, imagen_libro, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
      [isbn, titulo, autor, descripcion, genero, imageBuffer, false] // Aquí se establece estado en false
    );

    return res.status(201).json({ message: 'Libro agregado exitosamente con estado false.' });
  } catch (error) {
    console.error('Error al agregar libro:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

router.get('/libros-estado-false', async (req, res) => {
  console.log('Request a /libros/estado-false'); // Log para verificar que la ruta se alcanza
  try {
    const [libros] = await db.query('SELECT isbn, titulo, autor, descripcion, genero, TO_BASE64(imagen_libro) AS imagen_libro_base64 FROM libro WHERE estado = 0');
    
    console.log('Libros encontrados:', libros); // Muestra lo que se recibe de la consulta
    
    if (!libros || libros.length === 0) {
      console.log('No se encontraron libros con estado false.');
      return res.status(404).json({ message: 'No se encontraron libros.' });
    }

    return res.status(200).json(libros);
  } catch (error) {
    console.error('Error al obtener libros con estado false:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
});
router.post('/cancelar-solicitud/:id_prestamo', async (req, res) => {
  const { id_prestamo } = req.params;

  try {
    const query = 'UPDATE prestamo SET estado_prestamo = "Cancelado" WHERE id_prestamo = ?';
    const [result] = await db.execute(query, [id_prestamo]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    return res.status(200).json({ message: 'Solicitud cancelada exitosamente' });
  } catch (error) {
    console.error('Error al cancelar la solicitud:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
});
router.post('/actualizar-estado-resena/:id_prestamo', async (req, res) => {
  const { id_prestamo } = req.params;

  try {
    const query = 'UPDATE prestamo SET estado_prestamo = "Reseña Exitosa" WHERE id_prestamo = ?';
    const [result] = await db.execute(query, [id_prestamo]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    return res.status(200).json({ message: 'Estado de la solicitud actualizado a "Reseña Exitosa"' });
  } catch (error) {
    console.error('Error al actualizar el estado de la solicitud:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
});
router.post('/devolver-libro/:id_prestamo', async (req, res) => {
  const { id_prestamo } = req.params;

  try {
    const query = 'UPDATE prestamo SET estado_prestamo = "Devuelto" WHERE id_prestamo = ?';
    const [result] = await db.execute(query, [id_prestamo]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    return res.status(200).json({ message: 'Libro devuelto exitosamente' });
  } catch (error) {
    console.error('Error al devolver el libro:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
});
router.get('/obtener-detalles-libro/:id_prestamo', async (req, res) => {
  const { id_prestamo } = req.params;

  try {
    // Obtener el libro relacionado con el id_prestamo
    const query = `
      SELECT l.isbn, l.titulo, l.autor, l.descripcion, l.genero, u.nombre_usuario
      FROM prestamo p
      JOIN biblioteca_usuario b ON p.id_biblioteca = b.id_biblioteca
      JOIN libro l ON b.isbn = l.isbn
      JOIN usuario u ON b.id_usuario = u.id_usuario
      WHERE p.id_prestamo = ?`;

    const [rows] = await db.execute(query, [id_prestamo]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Libro no encontrado para este préstamo' });
    }

    // Devuelve los detalles del libro y el nombre del prestamista
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener los detalles del libro:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
});

router.delete('/eliminar-solicitud1/:id_prestamo', async (req, res) => {
  const { id_prestamo } = req.params;

  try {
    const query = 'DELETE FROM prestamo WHERE id_prestamo = ?';
    const [result] = await db.execute(query, [id_prestamo]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    return res.status(200).json({ message: 'Solicitud eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la solicitud:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
});
router.get('/prestamos1/:id_prestamo', async (req, res) => {
  const { id_prestamo } = req.params;

  try {
    // Obtener los detalles del préstamo
    const query = `
      SELECT p.id_prestamo, p.id_usuario_solicitante, u.correo AS correo_solicitante
      FROM prestamo p
      JOIN usuario u ON p.id_usuario_solicitante = u.id_usuario
      WHERE p.id_prestamo = ?`;

    const [rows] = await db.execute(query, [id_prestamo]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    // Devuelve los detalles del préstamo
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener los detalles del préstamo:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
});
// Endpoint para obtener un préstamo por su ID
// Endpoint para obtener un préstamo por su ID
router.get('/prestamos/:id_prestamo', (req, res) => {
  const id = req.params.id_prestamo; // Cambiado a id_prestamo

  if (!id) {
    return res.status(400).json({ message: "El ID es requerido" });
  }

  // Consulta JOIN entre prestamo, biblioteca_usuario y libro para obtener detalles del préstamo y libro
  const query = `
    SELECT p.*, b.isbn, l.titulo, l.autor, l.descripcion, l.genero
    FROM prestamo p
    JOIN biblioteca_usuario b ON p.id_biblioteca = b.id_biblioteca
    JOIN libro l ON b.isbn = l.isbn
    WHERE p.id_prestamo = ?
  `;

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error al obtener el préstamo:", error);
      return res.status(500).json({ message: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }

    res.status(200).json(results[0]); // Devolvemos los detalles del préstamo y el libro
  });
});



// Modificar libro de estado false a true
router.put('/libros-modificar/:isbn', async (req, res) => {
  const { isbn } = req.params; // Obtén el ISBN del libro de los parámetros de la ruta

  try {
    const [libro] = await db.query('SELECT * FROM libro WHERE isbn = ?', [isbn]);

    // Verificar si el libro existe
    if (!libro || libro.length === 0) {
      return res.status(404).json({ message: 'Libro no encontrado.' });
    }

    // Actualizar el estado del libro a true
    await db.query('UPDATE libro SET estado = true WHERE isbn = ?', [isbn]);

    return res.status(200).json({ message: 'Estado del libro actualizado a true.' });
  } catch (error) {
    console.error('Error al modificar estado del libro:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Eliminar libro
router.delete('/libros-eliminar/:isbn', async (req, res) => {
  const { isbn } = req.params; // Obtén el ISBN del libro de los parámetros de la ruta

  try {
    // Verificar si el libro existe
    const [libro] = await db.query('SELECT * FROM libro WHERE isbn = ?', [isbn]);

    if (!libro || libro.length === 0) {
      return res.status(404).json({ message: 'Libro no encontrado.' });
    }

    // Eliminar el libro de la base de datos
    await db.query('DELETE FROM libro WHERE isbn = ?', [isbn]);

    return res.status(200).json({ message: 'Libro eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar libro:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

router.put('/libros-cambio-prestamo/:isbn', async (req, res) => {
  const { isbn } = req.params; // Obtiene el ISBN del libro
  const { disponible_prestamo } = req.body; // Obtiene el nuevo estado de préstamo

  try {
    const [libro] = await db.query('SELECT * FROM biblioteca_usuario WHERE isbn = ?', [isbn]);

    // Verificar si el libro existe
    if (!libro || libro.length === 0) {
      return res.status(404).json({ message: 'Libro no encontrado.' });
    }

    // Actualiza el estado de préstamo
    await db.query('UPDATE biblioteca_usuario SET disponible_prestamo = ? WHERE isbn = ?', [disponible_prestamo, isbn]);

    return res.status(200).json({ message: 'Estado de préstamo actualizado.' });
  } catch (error) {
    console.error('Error al modificar estado de préstamo:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

router.put('/libros-cambio-intercambio/:isbn', async (req, res) => {
  const { isbn } = req.params; // Obtiene el ISBN del libro
  const { disponible_intercambio } = req.body; // Obtiene el nuevo estado de intercambio

  try {
    const [libro] = await db.query('SELECT * FROM biblioteca_usuario WHERE isbn = ?', [isbn]);

    // Verificar si el libro existe
    if (!libro || libro.length === 0) {
      return res.status(404).json({ message: 'Libro no encontrado.' });
    }

    // Actualiza el estado de intercambio
    await db.query('UPDATE biblioteca_usuario SET disponible_intercambio = ? WHERE isbn = ?', [disponible_intercambio, isbn]);

    return res.status(200).json({ message: 'Estado de intercambio actualizado.' });
  } catch (error) {
    console.error('Error al modificar estado de intercambio:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

router.get('/personas-con-libro/:isbn/:idUsuarioLogeado', async (req, res) => {
  const { isbn, idUsuarioLogeado } = req.params; // Obtener ISBN y ID del usuario logeado de los parámetros de la ruta

  console.log(`Recibiendo solicitud para listar personas con el libro ISBN: ${isbn}, excluyendo al usuario ID: ${idUsuarioLogeado}`);

  const query = `
    SELECT 
      usuario.id_usuario, 
      usuario.nombre_usuario, 
      usuario.correo, 
      usuario.ubicacion, 
      usuario.telefono, 
      TO_BASE64(usuario.foto_perfil) AS foto_perfil_base64,  
      libro.titulo, 
      libro.genero, 
      libro.autor,
      biblioteca_usuario.disponible_intercambio,
      biblioteca_usuario.disponible_prestamo,
      biblioteca_usuario.id_biblioteca 
    FROM biblioteca_usuario
    JOIN libro ON libro.isbn = biblioteca_usuario.isbn
    JOIN usuario ON usuario.id_usuario = biblioteca_usuario.id_usuario
    WHERE biblioteca_usuario.isbn = ?
      AND (biblioteca_usuario.disponible_prestamo = 1 OR biblioteca_usuario.disponible_intercambio = 1)
      AND libro.estado = 1
      AND usuario.id_usuario != ?
  `;

  try {
    const [results] = await db.query(query, [isbn, idUsuarioLogeado]);
    console.log('Resultados obtenidos:', results);
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios con este libro disponible para préstamo o intercambio.' });
    }
    
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener usuarios con el libro:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

router.post('/prestamo', (req, res) => {
  const { id_usuario_solicitante, id_usuario_prestamista, id_biblioteca } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_solicitante || !id_usuario_prestamista || !id_biblioteca) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  // Paso 1: Insertar el préstamo en la tabla 'prestamo'
  const insertQuery = `
    INSERT INTO prestamo (id_usuario_solicitante, id_usuario_prestamista, id_biblioteca, fecha_prestamo, estado_prestamo) 
    VALUES (?, ?, ?, null, 'pendiente')
  `;

  db.query(insertQuery, [id_usuario_solicitante, id_usuario_prestamista, id_biblioteca], (error, results) => {
    if (error) {
      console.error('Error al insertar el préstamo:', error);
      return res.status(500).json({ error: 'Error al insertar el préstamo' });
    }

    // Obtener el ID del préstamo insertado
    const lastInsertId = results.insertId;
    console.log('Préstamo insertado con ID:', lastInsertId);

    return res.status(200).json({
      message: 'Préstamo creado con éxito',
      prestamoId: lastInsertId,
      id_usuario_prestamista // Pasar el ID del prestamista para su uso en la notificación
    });
  });
});
router.post('/notificacion_aceptacion', async (req, res) => {
  // Aquí recibimos los campos enviados desde el frontend
  const { correo, titulo, descripcion } = req.body;

  // Asegúrate de que el backend reciba tanto el correo del solicitante como el mensaje
  if (!correo || !titulo || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  // Asignamos el correo del solicitante de acuerdo a los datos recibidos
  const correoSolicitante = correo; // Suponiendo que "correo" es el del solicitante

  // Inserción de notificación para el solicitante
  const insertNotificacionSolicitanteQuery = `
    INSERT INTO notificacion (correo, titulo, descripcion, tipo) 
    VALUES (?, ?, ?, 'Solicitud aceptada')
  `;
  
  try {
    // Insertar notificación para el solicitante
    await db.query(insertNotificacionSolicitanteQuery, [correoSolicitante, titulo, descripcion]);

    console.log('Notificación insertada para el solicitante con éxito.');
    return res.status(201).json({ message: 'Notificación de aceptación enviada con éxito' });

  } catch (error) {
    console.error('Error al insertar la notificación de aceptación:', error);
    return res.status(500).json({ error: 'Error al insertar la notificación de aceptación' });
  }
});
router.post('/notificaciones', async (req, res) => {
  const { correo, titulo, descripcion } = req.body;

  if (!correo || !titulo || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  const insertNotificacionQuery = `
    INSERT INTO notificacion (correo, titulo, descripcion, tipo) 
    VALUES (?, ?, ?, 'Devolución')
  `;

  try {
    await db.query(insertNotificacionQuery, [correo, titulo, descripcion]);
    console.log('Notificación insertada con éxito.');
    return res.status(201).json({ message: 'Notificación creada exitosamente.' });
  } catch (error) {
    console.error('Error al insertar la notificación:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});


router.post('/notificacion_prestamo', async (req, res) => {
  // Aquí recibimos los campos enviados desde el frontend
  const { correo, titulo, descripcion } = req.body;

  // Asegúrate de que el backend reciba tanto el correo del solicitante como el del prestamista
  if (!correo || !titulo || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  // Asignamos el correo prestamista y correo solicitante de acuerdo a los datos recibidos
  const correoSolicitante = correo; // Suponiendo que "correo" es el del solicitante
  const correoPrestamista = req.body.correoPrestamista; // Suponiendo que este dato también debe enviarse desde el frontend

  // Inserción de notificación para el prestamista
  const insertNotificacionPrestamistaQuery = `
    INSERT INTO notificacion (correo, titulo, descripcion, tipo) 
    VALUES (?, ?, ?, 'Solicitud recibida')
  `;
  
  try {
    // Insertar notificación para el prestamista
    await db.query(insertNotificacionPrestamistaQuery, [correoPrestamista, titulo, descripcion]);

    console.log('Notificación insertada para el prestamista con éxito.');

    // Insertar notificación para el solicitante
    const insertNotificacionSolicitanteQuery = `
      INSERT INTO notificacion (correo, titulo, descripcion, tipo) 
      VALUES (?, ?, ?, 'Solicitud realizada')
    `;
    
    await db.query(insertNotificacionSolicitanteQuery, [correoSolicitante, titulo, descripcion]);

    console.log('Notificación insertada para el solicitante con éxito.');
    return res.status(201).json({ message: 'Notificaciones insertadas con éxito' });

  } catch (error) {
    console.error('Error al insertar las notificaciones:', error);
    return res.status(500).json({ error: 'Error al insertar las notificaciones' });
  }
});

// Endpoint para obtener notificaciones de un usuario
router.get('/notificaciones/:correo', async (req, res) => {
  const { correo } = req.params;

  if (!correo) {
    return res.status(400).json({ error: 'Correo es requerido para obtener notificaciones.' });
  }

  try {
    // Consulta las notificaciones asociadas a ese correo
    const [results] = await db.query(
      'SELECT * FROM notificacion WHERE correo = ? ORDER BY fecha_creacion DESC',
      [correo]
    );

    // Envia las notificaciones encontradas
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    return res.status(500).json({ error: 'Error al obtener las notificaciones' });
  }
});

// Endpoint para marcar una notificación como vista
router.put('/notificaciones/:id/visto', async (req, res) => {
  const { id } = req.params;

  try {
    // Actualizar el campo "visto" de la notificación con el ID dado
    await db.query(
      'UPDATE notificacion SET visto = TRUE WHERE id_notificacion = ?',
      [id]
    );
    return res.status(200).json({ message: 'Notificación marcada como vista' });
  } catch (error) {
    console.error('Error al marcar notificación como vista:', error);
    return res.status(500).json({ error: 'Error al marcar la notificación como vista' });
  }
});

// Endpoint para eliminar una notificación
router.delete('/notificaciones/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Eliminar la notificación con el ID dado
    await db.query(
      'DELETE FROM notificacion WHERE id_notificacion = ?',
      [id]
    );
    return res.status(200).json({ message: 'Notificación eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la notificación:', error);
    return res.status(500).json({ error: 'Error al eliminar la notificación' });
  }
});
// Agregar a tu controller.js
router.post('/notificar-aceptacion', async (req, res) => {
  const { correoSolicitante, correoPrestamista, titulo, descripcion } = req.body;

  if (!correoSolicitante || !correoPrestamista || !titulo || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  const insertNotificacionSolicitanteQuery = `
    INSERT INTO notificacion (correo, titulo, descripcion, tipo) 
    VALUES (?, ?, ?, 'Préstamo aceptado')
  `;

  try {
    // Insertar notificación para el solicitante
    await db.query(insertNotificacionSolicitanteQuery, [correoSolicitante, titulo, descripcion]);

    console.log('Notificación enviada al solicitante con éxito.');
    return res.status(201).json({ message: 'Notificación enviada al solicitante con éxito.' });
  } catch (error) {
    console.error('Error al insertar la notificación:', error);
    return res.status(500).json({ error: 'Error al insertar la notificación' });
  }
});


router.get('/ps/:correo', async (req, res) => {
  const { correo } = req.params;

  if (!correo) {
    return res.status(400).json({ error: 'El correo del usuario es requerido.' });
  }

  // Consulta para obtener las solicitudes de préstamo donde el correo coincide con el prestamista
  const getSolicitudesQuery = `
    SELECT p.id_prestamo, p.id_usuario_solicitante AS id_solicitante, p.id_usuario_prestamista AS id_prestamista, p.id_biblioteca, 
           u.nombre_usuario AS prestamista, libro.titulo AS titulo, u.correo ,a.correo AS correo_2, p.estado_prestamo,
           p.fecha_prestamo
    FROM prestamo p
    JOIN usuario u ON p.id_usuario_prestamista = u.id_usuario
    JOIN usuario a ON p.id_usuario_solicitante = a.id_usuario
    JOIN biblioteca_usuario ON biblioteca_usuario.id_biblioteca = p.id_biblioteca
    JOIN libro ON libro.isbn = biblioteca_usuario.isbn
    WHERE p.id_usuario_prestamista = (
      SELECT id_usuario FROM usuario WHERE correo = ?
    )
  `;

  try {
    // Usar await para la consulta
    const [results] = await db.query(getSolicitudesQuery, [correo]);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener las solicitudes de préstamo:', error);
    return res.status(500).json({ error: 'Error al obtener las solicitudes de préstamo' });
  }
});

router.get('/ss/:correo', async (req, res) => {
  const { correo } = req.params;

  if (!correo) {
    return res.status(400).json({ error: 'El correo del usuario es requerido.' });
  }

  // Consulta para obtener las solicitudes de préstamo donde el correo coincide con el solicitante
  const getSolicitudesQuery = `
    SELECT p.id_prestamo, p.id_usuario_solicitante AS id_solicitante, p.id_usuario_prestamista AS id_prestamista, p.id_biblioteca, 
           u.nombre_usuario AS prestamista, libro.titulo AS titulo, u.correo, a.correo AS correo_2, 
           p.estado_prestamo, p.fecha_prestamo
    FROM prestamo p
    JOIN usuario u ON p.id_usuario_prestamista = u.id_usuario
    JOIN usuario a ON p.id_usuario_solicitante = a.id_usuario
    JOIN biblioteca_usuario ON biblioteca_usuario.id_biblioteca = p.id_biblioteca
    JOIN libro ON libro.isbn = biblioteca_usuario.isbn
    WHERE p.id_usuario_solicitante = (
      SELECT id_usuario FROM usuario WHERE correo = ?
    )
  `;

  try {
    // Usar await para la consulta
    const [results] = await db.query(getSolicitudesQuery, [correo]);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener las solicitudes de préstamo:', error);
    return res.status(500).json({ error: 'Error al obtener las solicitudes de préstamo' });
  }
});

router.delete('/solicitud/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'El id de la solicitud es requerido.' });
  }

  const deleteSolicitudQuery = `
    DELETE FROM prestamo WHERE id_prestamo = ?
  `;

  try {
    const [result] = await db.query(deleteSolicitudQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró la solicitud para eliminar.' });
    }

    res.status(200).json({ message: 'Solicitud eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar la solicitud:', error);
    return res.status(500).json({ error: 'Error al eliminar la solicitud' });
  }
});
router.put('/solicitud/:id/desarrollo', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'El id de la solicitud es requerido.' });
  }

  const updateEstadoQuery = `
    UPDATE prestamo SET estado_prestamo = 'desarrollo' WHERE id_prestamo = ?
  `;

  try {
    const [result] = await db.query(updateEstadoQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró la solicitud para actualizar.' });
    }

    res.status(200).json({ message: 'El estado de la solicitud fue actualizado a desarrollo.' });
  } catch (error) {
    console.error('Error al actualizar el estado de la solicitud:', error);
    return res.status(500).json({ error: 'Error al actualizar el estado de la solicitud' });
  }
});

router.put('/solicitud/:id/:estado', async (req, res) => {
  const { id, estado } = req.params;

  if (!id || !estado) {
    return res.status(400).json({ error: 'El id de la solicitud y el estado son requeridos.' });
  }

  const updateEstadoQuery = `
    UPDATE prestamo SET estado_prestamo = ? WHERE id_prestamo = ?
  `;

  try {
    const [result] = await db.query(updateEstadoQuery, [estado, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró la solicitud para actualizar.' });
    }

    res.status(200).json({ message: `El estado de la solicitud fue actualizado a ${estado}.` });
  } catch (error) {
    console.error('Error al actualizar el estado de la solicitud:', error);
    return res.status(500).json({ error: 'Error al actualizar el estado de la solicitud' });
  }
});
/// En el backend, asegúrate de tener un endpoint PUT para actualizar el estado a "Entregado".
router.put('/solicitud/:id/entregado', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'El id de la solicitud es requerido.' });
  }

  const updateEstadoQuery = `
    UPDATE prestamo SET estado_prestamo = 'Entregado' WHERE id_prestamo = ?
  `;

  try {
    const [result] = await db.query(updateEstadoQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró la solicitud para actualizar.' });
    }

    res.status(200).json({ message: 'El estado de la solicitud fue actualizado a "Entregado".' });
  } catch (error) {
    console.error('Error al actualizar el estado de la solicitud:', error);
    return res.status(500).json({ error: 'Error al actualizar el estado de la solicitud' });
  }
});


router.put('/solicitud/:id/por-entregar', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'El id de la solicitud es requerido.' });
  }

  const updateEstadoQuery = `
    UPDATE prestamo SET estado_prestamo = 'Por entregar' WHERE id_prestamo = ?
  `;

  try {
    const [result] = await db.query(updateEstadoQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró la solicitud para actualizar.' });
    }

    res.status(200).json({ message: 'El estado de la solicitud fue actualizado a por entregar.' });
  } catch (error) {
    console.error('Error al actualizar el estado de la solicitud:', error);
    return res.status(500).json({ error: 'Error al actualizar el estado de la solicitud' });
  }
});

router.put('/solicitud/:id/devolucion', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'El id de la solicitud es requerido.' });
  }

  const updateEstadoQuery = `
    UPDATE prestamo SET estado_prestamo = 'devolucion' WHERE id_prestamo = ?
  `;

  try {
    const [result] = await db.query(updateEstadoQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró la solicitud para actualizar.' });
    }

    res.status(200).json({ message: 'El estado de la solicitud fue actualizado a devolucion.' });
  } catch (error) {
    console.error('Error al actualizar el estado de la solicitud:', error);
    return res.status(500).json({ error: 'Error al actualizar el estado de la solicitud' });
  }
});

router.post('/crear-chat-prestamo/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'El id del préstamo es requerido.' });
  }

  // Consulta para obtener los datos del préstamo
  const getPrestamoQuery = `
    SELECT id_prestamo, id_biblioteca, estado_prestamo
    FROM prestamo
    WHERE id_prestamo = ?
  `;

  // Consulta para insertar el nuevo chat, dejando el campo id_biblioteca_usuario_solicitante como null
  const createChatQuery = `
    INSERT INTO chat (id_biblioteca_usuario_ofertante, id_biblioteca_usuario_solicitante, tipo_chat, id_estado)
    VALUES (?, NULL, ?, ?)
  `;

  try {
    // Obtener los detalles del préstamo
    const [prestamo] = await db.query(getPrestamoQuery, [id]);

    if (prestamo.length === 0) {
      return res.status(404).json({ message: 'No se encontró el préstamo.' });
    }

    const { id_prestamo, id_biblioteca, estado_prestamo } = prestamo[0];

    // Verificar si el estado es "desarrollo"
    if (estado_prestamo !== 'desarrollo') {
      return res.status(400).json({ message: 'El préstamo no está en estado "desarrollo".' });
    }

    // Crear el chat en la base de datos, dejando id_biblioteca_usuario_solicitante como null
    const [result] = await db.query(createChatQuery, [
      id_biblioteca,  // Se usa id_biblioteca en lugar de id_biblioteca_usuario_ofertante
      'prestamo', // El tipo de chat es 'prestamo'
      id_prestamo  // Asociar el id del préstamo como id_estado
    ]);

    // Responder con el chat creado
    res.status(201).json({ message: 'Chat creado exitosamente', chatId: result.insertId });
  } catch (error) {
    console.error('Error al crear el chat:', error);
    return res.status(500).json({ error: 'Error al crear el chat' });
  }
});


router.get('/listar-chats/:correo_usuario', async (req, res) => {
  const { correo_usuario } = req.params;

  if (!correo_usuario) {
    return res.status(400).json({ error: 'El correo del usuario es requerido.' });
  }

  // Consulta para obtener los chats de tipo 'prestamo' en los que el usuario está involucrado
  const listarChatsQuery = `
    SELECT c.id_chat, 
           u1.nombre_usuario AS correo_usuario_prestamista, 
           u2.nombre_usuario AS correo_usuario_solicitante,
           l.titulo,
           c.tipo_chat,
           TO_BASE64(u1.foto_perfil) AS foto_prestamista,
           TO_BASE64(u2.foto_perfil) AS foto_solicitante
    FROM chat c
    JOIN prestamo p ON c.id_estado = p.id_prestamo
    JOIN biblioteca_usuario bu ON bu.id_biblioteca=p.id_biblioteca
    JOIN libro l ON l.isbn = bu.isbn 
    LEFT JOIN usuario u1 ON p.id_usuario_prestamista = u1.id_usuario
    LEFT JOIN usuario u2 ON p.id_usuario_solicitante = u2.id_usuario
    WHERE (u1.correo = ? OR u2.correo = ?) 
  `;

  try {
    const [chats] = await db.query(listarChatsQuery, [correo_usuario, correo_usuario]);

    if (chats.length === 0) {
      return res.status(404).json({ message: 'No se encontraron chats de préstamo.' });
    }

    res.status(200).json({ chats });
  } catch (error) {
    console.error('Error al listar los chats:', error);
    return res.status(500).json({ error: 'Error al listar los chats' });
  }
});

router.post('/enviar-mensaje', async (req, res) => {
  const { id_chat, id_usuario_remitente, contenido } = req.body;

  if (!id_chat || !id_usuario_remitente || !contenido) {
    return res.status(400).json({ error: 'Faltan datos para enviar el mensaje.' });
  }

  const crearMensajeQuery = `
    INSERT INTO mensaje (id_chat, id_usuario_remitente, contenido)
    VALUES (?, ?, ?)
  `;

  try {
    const [result] = await db.query(crearMensajeQuery, [id_chat, id_usuario_remitente, contenido]);

    res.status(201).json({ message: 'Mensaje enviado exitosamente', mensajeId: result.insertId });
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    return res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
});


router.get('/listar-mensajes/:id_chat', async (req, res) => {
  const { id_chat } = req.params;

  if (!id_chat) {
    return res.status(400).json({ error: 'El ID del chat es requerido.' });
  }

  const listarMensajesQuery = `
    SELECT m.id_mensaje, 
           m.contenido, 
           m.enviado_en, 
           u.correo AS correo_remitente,
           u.nombre_usuario,
           u.id_usuario
    FROM mensaje m
    JOIN usuario u ON m.id_usuario_remitente = u.id_usuario
    WHERE m.id_chat = ?
    ORDER BY m.enviado_en ASC
  `;

  try {
    const [mensajes] = await db.query(listarMensajesQuery, [id_chat]);

    if (mensajes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron mensajes.' });
    }

    res.status(200).json({ mensajes });
  } catch (error) {
    console.error('Error al listar los mensajes:', error);
    return res.status(500).json({ error: 'Error al listar los mensajes' });
  }
});

async function deleteBookAndRelatedData(isbn, id_usuario, res) {
    let errorOccurred = false; 

    try {
        // Primero, intenta eliminar los mensajes
        await deleteMessages(isbn, id_usuario);
    } catch (err) {
        console.error('Error al eliminar los mensajes:', err.message);
        errorOccurred = true; // Marcar que ocurrió un error
    }

    try {
        // Luego, intenta eliminar los chats
        await deleteChats(isbn, id_usuario);
    } catch (err) {
        console.error('Error al eliminar los chats:', err.message);
        errorOccurred = true; // Marcar que ocurrió un error
    }

    try {
        // Luego, intenta eliminar los préstamos
        await deleteLoans(isbn, id_usuario);
    } catch (err) {
        console.error('Error al eliminar los préstamos:', err.message);
        errorOccurred = true; // Marcar que ocurrió un error
    }

    try {
        // Finalmente, intenta eliminar el libro de la biblioteca
        await deleteBookFromLibrary(isbn, id_usuario);
    } catch (err) {
        console.error('Error al eliminar el libro:', err.message);
        errorOccurred = true; // Marcar que ocurrió un error
    }

    // Respuesta final después de intentar todas las eliminaciones
    if (errorOccurred) {
        return res.status(500).json({ message: 'Algunas eliminaciones fallaron' });
    }
    res.json({ message: 'Proceso de eliminación completado' });
}

// Función para eliminar los mensajes
function deleteMessages(isbn, id_usuario, callback) {
  const deleteMessagesQuery = `
    DELETE FROM mensaje 
    WHERE id_chat IN (
      SELECT id_chat 
      FROM chat 
      WHERE id_biblioteca_usuario_ofertante IN (
        SELECT id_biblioteca 
        FROM biblioteca_usuario 
        WHERE isbn = ? AND id_usuario = ?
      )
    )
  `;
  db.query(deleteMessagesQuery, [isbn, id_usuario], callback);
}

// Función para eliminar los chats
function deleteChats(isbn, id_usuario, callback) {
  const deleteChatsQuery = `
    DELETE FROM chat 
    WHERE id_biblioteca_usuario_ofertante IN (
      SELECT id_biblioteca 
      FROM biblioteca_usuario 
      WHERE isbn = ? AND id_usuario = ?
    )
  `;
  db.query(deleteChatsQuery, [isbn, id_usuario], callback);
}

// Función para eliminar los préstamos
function deleteLoans(isbn, id_usuario, callback) {
  const deleteLoansQuery = `
    DELETE FROM prestamo 
    WHERE id_biblioteca IN (
      SELECT id_biblioteca 
      FROM biblioteca_usuario 
      WHERE isbn = ? AND id_usuario = ?
    )
  `;
  db.query(deleteLoansQuery, [isbn, id_usuario], callback);
}

// Función para eliminar el libro de la biblioteca del usuario
function deleteBookFromLibrary(isbn, id_usuario, callback) {
  const deleteBookQuery = `DELETE FROM biblioteca_usuario WHERE isbn = ? AND id_usuario = ?`;
  db.query(deleteBookQuery, [isbn, id_usuario], callback);
}
// Ruta para eliminar el libro y todos los datos relacionados
router.delete('/:isbn/:id_usuario', (req, res) => {
  const { isbn, id_usuario } = req.params;
  deleteBookAndRelatedData(isbn, id_usuario, res);
});

router.put('/prestamo/devolucion', (req, res) => {
  const { id_prestamo, fecha_devolucion } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_prestamo || !fecha_devolucion) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  // Actualizar solo la fecha de devolución en el préstamo
  const updateQuery = `
    UPDATE prestamo 
    SET fecha_prestamo = ? 
    WHERE id_prestamo = ?
  `;

  // Ejecutar la consulta de actualización
  db.query(updateQuery, [fecha_devolucion, id_prestamo], (err, result) => {
    if (err) {
      console.error('Error al actualizar la fecha de devolución:', err.message);
      return res.status(500).json({ error: 'Error al actualizar la fecha de devolución.' });
    }
    res.status(200).json({ message: 'Fecha de devolución actualizada exitosamente.' });
  });
});

router.post('/agregar-favorito', async (req, res) => {
  const { correo, isbn } = req.body; // Recibe los datos del cuerpo de la solicitud

  if (!correo || !isbn) {
    return res.status(400).json({ message: 'Correo e ISBN son requeridos' });
  }

  try {
    // Verificar si ya existe el libro en favoritos
    const checkQuery = `
      SELECT * FROM favorito_libro 
      WHERE correo = ? AND isbn = ?
    `;
    const [rows] = await db.execute(checkQuery, [correo, isbn]);

    if (rows.length > 0) {
      return res.status(409).json({ message: 'El libro ya está en favoritos' });
    }

    // Si no existe, agregar el libro a favoritos
    const insertQuery = `
      INSERT INTO favorito_libro (correo, isbn)
      VALUES (?, ?)
    `;
    await db.execute(insertQuery, [correo, isbn]);

    res.status(201).json({ message: 'Libro agregado a favoritos exitosamente' });
  } catch (error) {
    console.error('Error al agregar libro a favoritos:', error);
    res.status(500).json({ message: 'Error al agregar libro a favoritos' });
  }
});

router.get('/favoritos/:correo', async (req, res) => {
  const { correo } = req.params;

  try {
    const query = `
      SELECT libro.isbn, libro.titulo, libro.autor, libro.genero, libro.descripcion,TO_BASE64(libro.imagen_libro) AS imagen
      FROM favorito_libro
      JOIN libro ON favorito_libro.isbn = libro.isbn
      WHERE favorito_libro.correo = ?
    `;
    const [rows] = await db.execute(query, [correo]);

    res.status(200).json(rows); // Devuelve la lista de libros favoritos
  } catch (error) {
    console.error('Error al obtener libros favoritos:', error);
    res.status(500).json({ message: 'Error al obtener libros favoritos' });
  }
});
router.delete('/eliminar-favorito', async (req, res) => {
  const { correo, isbn } = req.body;

  if (!correo || !isbn) {
    return res.status(400).json({ message: 'Correo e ISBN son requeridos' });
  }

  try {
    const query = `
      DELETE FROM favorito_libro
      WHERE correo = ? AND isbn = ?
    `;
    const [result] = await db.execute(query, [correo, isbn]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'El libro no está en favoritos' });
    }

    res.status(200).json({ message: 'Libro eliminado de favoritos exitosamente' });
  } catch (error) {
    console.error('Error al eliminar libro de favoritos:', error);
    res.status(500).json({ message: 'Error al eliminar libro de favoritos' });
  }
});

router.post('/insertar-intercambio', async (req, res) => {
  const { id_usuario_ofertante, id_usuario_solicitante, id_biblioteca_prestamista, id_biblioteca_solicitante, estado } = req.body;
  
  // Validar que todos los campos necesarios estén presentes
  if (!id_usuario_ofertante || !id_usuario_solicitante || !estado) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    const query = `
      INSERT INTO intercambio (id_usuario_ofertante, id_usuario_solicitante, id_biblioteca_prestamista, id_biblioteca_solicitante, estado)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    // Ejecutar la consulta para insertar el intercambio
    await db.execute(query, [id_usuario_ofertante, id_usuario_solicitante, id_biblioteca_prestamista, id_biblioteca_solicitante, estado]);

    res.status(201).json({ message: 'Intercambio insertado exitosamente' });
  } catch (error) {
    console.error('Error al insertar el intercambio:', error);
    res.status(500).json({ message: 'Error al insertar el intercambio' });
  }
});
router.get('/obtener-id-biblioteca/:isbn/:id_usuario', async (req, res) => {
  const { isbn, id_usuario } = req.params;

  try {
    const query = `
      SELECT id_biblioteca 
      FROM biblioteca_usuario 
      WHERE isbn = ? AND id_usuario = ?`;
    
    const [rows] = await db.execute(query, [isbn, id_usuario]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró la biblioteca para este libro y usuario' });
    }

    res.status(200).json({ id_biblioteca: rows[0].id_biblioteca });
  } catch (error) {
    console.error('Error al obtener la id_biblioteca:', error);
    res.status(500).json({ message: 'Error al obtener la id_biblioteca' });
  }
});

router.get('/intercambios-solicitante/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const query = `
  SELECT
      i.id_intercambio AS id_intercambio,
      i.id_usuario_ofertante AS id_ofertante,
      i.id_usuario_solicitante AS id_solicitante,
      i.id_biblioteca_prestamista,
      i.id_biblioteca_solicitante,
      i.estado,
      us.nombre_usuario AS solicitante,
      u.nombre_usuario AS ofertante,
      l.titulo AS libro_titulo,
      lx.titulo AS libro_titulo2
 FROM intercambio i
 JOIN usuario u ON u.id_usuario = i.id_usuario_ofertante
 JOIN usuario us ON us.id_usuario = i.id_usuario_solicitante
 LEFT JOIN biblioteca_usuario bup ON bup.id_biblioteca = i.id_biblioteca_prestamista
 LEFT JOIN biblioteca_usuario bupp ON bupp.id_biblioteca = i.id_biblioteca_solicitante
 LEFT JOIN libro l ON l.isbn = bup.isbn
 LEFT JOIN libro lx ON lx.isbn = bupp.isbn
    WHERE i.id_usuario_solicitante = ?`;
      
    const [rows] = await db.execute(query, [id_usuario]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener intercambios como solicitante:', error);
    res.status(500).json({ message: 'Error al obtener intercambios' });
  }
});


router.get('/intercambios-prestamista/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const query = `
 SELECT
      i.id_intercambio AS id_intercambio,
      i.id_usuario_ofertante AS id_ofertante,
      i.id_usuario_solicitante AS id_solicitante,
      i.id_biblioteca_prestamista,
      i.id_biblioteca_solicitante,
      i.estado,
      us.nombre_usuario AS solicitante,
      u.nombre_usuario AS ofertante,
      l.titulo AS libro_titulo,
      lx.titulo AS libro_titulo2
 FROM intercambio i
 JOIN usuario u ON u.id_usuario = i.id_usuario_ofertante
 JOIN usuario us ON us.id_usuario = i.id_usuario_solicitante
 JOIN biblioteca_usuario bup ON bup.id_biblioteca = i.id_biblioteca_prestamista
 LEFT JOIN biblioteca_usuario bupp ON bupp.id_biblioteca = i.id_biblioteca_solicitante
 JOIN libro l ON l.isbn = bup.isbn
 LEFT JOIN libro lx ON lx.isbn = bupp.isbn
      WHERE i.id_usuario_ofertante = ?`;
    const [rows] = await db.execute(query, [id_usuario]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener intercambios como prestamista:', error);
    res.status(500).json({ message: 'Error al obtener intercambios' });
  }
});

router.get('/libros-disponibles-intercambio/:idUsuario', async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const query = `
      SELECT 
          bu.id_biblioteca AS id_biblioteca,
          bu.id_usuario,
          bu.isbn,
          l.titulo,
          l.autor,
          l.descripcion,
          l.genero,
          l.creado_en AS fecha_creacion_libro,
          bu.creado_en AS fecha_creacion_biblioteca,
          l.imagen_libro
      FROM 
          biblioteca_usuario bu
      JOIN 
          libro l ON bu.isbn = l.isbn
      WHERE 
          bu.id_usuario = ? 
          AND bu.disponible_intercambio = 1;
    `;

    const [rows] = await db.execute(query, [idUsuario]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron libros disponibles para intercambio.' });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los libros disponibles para intercambio:', error);
    res.status(500).json({ message: 'Error al obtener los libros disponibles para intercambio.' });
  }
});

router.put('/actualizarBibliotecaPrestamista', (req, res) => {
  const { id_intercambio, id_biblioteca_prestamista } = req.body;

  const query = `
    UPDATE intercambio 
    SET id_biblioteca_solicitante = ? 
    WHERE id_intercambio = ?`;

  db.query(query, [id_biblioteca_prestamista, id_intercambio], (error, results) => {
    if (error) {
      console.error('Error al actualizar el intercambio:', error);
      res.status(500).json({ error: 'Error al actualizar el intercambio' });
    } else {
      res.status(200).json({ message: 'Intercambio actualizado correctamente', results });
    }
  });
});

router.post('/reportar', async (req, res) => {
  const { usuario_reportado, usuario_reportante } = req.body;

  if (!usuario_reportado || !usuario_reportante) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  // Llamar al procedimiento ReportarUsuario
  const query = 'CALL ReportarUsuario(?, ?)';

  try {
    await db.query(query, [usuario_reportado, usuario_reportante]);

    // Contar los reportes del usuario reportado
    const countQuery = 'SELECT COUNT(*) AS reportes FROM reportar_usuario WHERE id_usuario_reportado = ?';
    const [countResults] = await db.query(countQuery, [usuario_reportado]);
    const reportes = countResults[0].reportes;

    // Lógica para enviar la notificación al usuario reportado
    const notificacionQuery = 'SELECT correo FROM usuario WHERE id_usuario = ?';
    const [notificacionResults] = await db.query(notificacionQuery, [usuario_reportado]);

    if (notificacionResults.length > 0) {
      const correo = notificacionResults[0].correo;
      const mensaje = `Has sido reportado. Tu cuenta está en peligro. Llevas ${reportes} reportes. Si Acumulas 5, tu cuenta sera suspendida`;

      // Insertar notificación en la tabla notificacion
      const insertNotificacionQuery = `
        INSERT INTO notificacion (correo, titulo, descripcion, tipo) 
        VALUES (?, ?, ?, 'Reporte de usuario')
      `;
      await db.query(insertNotificacionQuery, [correo, 'Reporte de usuario', mensaje]);

      enviarNotificacion(correo, mensaje);
      console.log('Notificación enviada al usuario reportado con éxito.');
      return res.status(201).json({ message: 'Reporte realizado correctamente y notificación enviada', reportes, notificacion: 'Notificación enviada al usuario reportado con éxito.' });
    } else {
      return res.status(404).json({ message: 'Usuario reportado no encontrado' });
    }
  } catch (error) {
    console.error('Error al reportar usuario:', error);
    return res.status(500).json({ error: 'Hubo un error al reportar al usuario.' });
  }
});

function enviarNotificacion(correo, mensaje) {
  // Simulación de envío de notificación por correo electrónico
  console.log(`Enviando notificación a ${correo}: ${mensaje}`);
}

router.get('/promedio-calificacion-sin-isbn/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;  // Obtienes el id_usuario desde los parámetros de la URL

  try {
    const query = `
      SELECT AVG(r.calificacion) AS promedio_calificacion
      FROM resena r
      JOIN usuario u ON u.id_usuario = r.id_usuario
      WHERE isbn IS NULL AND u.correo = ?`;

    const [rows] = await db.execute(query, [id_usuario]);

    if (rows.length === 0 || rows[0].promedio_calificacion === null) {
      return res.status(404).json({ message: 'No se encontraron reseñas para este usuario con isbn NULL' });
    }

    res.status(200).json({ promedio_calificacion: rows[0].promedio_calificacion });
  } catch (error) {
    console.error('Error al obtener el promedio de calificación:', error);
    res.status(500).json({ message: 'Error al obtener el promedio de calificación' });
  }
});

router.get('/obtener-id-chat/:id_estado', async (req, res) => {
  const { id_estado } = req.params;  // Obtienes el id_estado desde los parámetros de la URL
  const tipo_chat = 'prestamo';  // Tipo de chat fijo a 'prestamo'

  try {
    const query = `
      SELECT id_chat
      FROM chat
      WHERE id_estado = ? AND tipo_chat = ?
      LIMIT 1`;  // Limitamos la consulta a un solo chat

    const [rows] = await db.execute(query, [id_estado, tipo_chat]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró el id_chat con el estado y tipo de chat dados' });
    }

    res.status(200).json({ id_chat: rows[0].id_chat });
  } catch (error) {
    console.error('Error al obtener el id_chat:', error);
    res.status(500).json({ message: 'Error al obtener el id_chat' });
  }
});
router.put('/actualizarEstadoIntercambio/:id_intercambio', async (req, res) => {
  const { id_intercambio } = req.params;
  const { estado } = req.body;

  try {
      // Validar que los parámetros estén presentes
      if (!id_intercambio || !estado) {
          return res.status(400).json({ message: 'Faltan parámetros requeridos.' });
      }

      // Actualizar el estado en la base de datos
      const query = `
          UPDATE intercambio 
          SET estado = ? 
          WHERE id_intercambio = ?
      `;
      const result = await db.query(query, [estado, id_intercambio]);

      // Verificar si se realizó alguna modificación
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Intercambio no encontrado.' });
      }

      res.status(200).json({ message: 'Estado actualizado correctamente.' });
  } catch (error) {
      console.error('Error al actualizar el estado del intercambio:', error);
      res.status(500).json({ message: 'Error del servidor.' });
  }
});
router.post('/crear-chat-intercambio/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'El id del intercambio es requerido.' });
  }

  // Consulta para obtener los datos del intercambio
  const getIntercambioQuery = `
    SELECT id_intercambio, id_biblioteca_solicitante, id_biblioteca_prestamista, estado
    FROM intercambio
    WHERE id_intercambio = ?
  `;

  // Consulta para insertar el nuevo chat, usando id_biblioteca_usuario_ofertante
  const createChatQuery = `
    INSERT INTO chat (id_biblioteca_usuario_ofertante, id_biblioteca_usuario_solicitante, tipo_chat, id_estado)
    VALUES (?, ?, ?, ?)
  `;

  try {
    // Obtener los detalles del intercambio
    const [intercambio] = await db.query(getIntercambioQuery, [id]);

    if (intercambio.length === 0) {
      return res.status(404).json({ message: 'No se encontró el intercambio.' });
    }

    const { id_intercambio, id_biblioteca_solicitante, id_biblioteca_prestamista, estado } = intercambio[0];

    // Verificar si el estado es "pendiente" o el que corresponda para permitir crear el chat
   

    // Crear el chat en la base de datos, usando id_biblioteca_prestamista como ofertante
    const [result] = await db.query(createChatQuery, [
      id_biblioteca_prestamista,  // Se usa id_biblioteca_prestamista como ofertante
      id_biblioteca_solicitante,  // Se usa id_biblioteca_solicitante como solicitante
      'intercambio',              // El tipo de chat es 'intercambio'
      id_intercambio              // Asociar el id del intercambio como id_estado
    ]);

    // Responder con el chat creado
    res.status(201).json({ message: 'Chat de intercambio creado exitosamente', chatId: result.insertId });
  } catch (error) {
    console.error('Error al crear el chat:', error);
    return res.status(500).json({ error: 'Error al crear el chat' });
  }
});

router.get('/listar-chats-intercambio/:correo_usuario', async (req, res) => {
  const { correo_usuario } = req.params;

  if (!correo_usuario) {
    return res.status(400).json({ error: 'El correo del usuario es requerido.' });
  }

  // Consulta para obtener los chats de tipo 'intercambio' en los que el usuario está involucrado
  const listarChatsIntercambioQuery = `
    SELECT c.id_chat, 
           u1.nombre_usuario AS correo_usuario_prestamista, 
           u2.nombre_usuario AS correo_usuario_solicitante,
           c.tipo_chat,
           TO_BASE64(u1.foto_perfil) AS foto_prestamista,
           TO_BASE64(u2.foto_perfil) AS foto_solicitante
    FROM chat c
    JOIN intercambio i ON c.id_estado = i.id_intercambio
    LEFT JOIN usuario u1 ON i.id_usuario_ofertante = u1.id_usuario
    LEFT JOIN usuario u2 ON i.id_usuario_solicitante = u2.id_usuario
    WHERE (u1.correo = ? OR u2.correo = ?)
  `;

  try {
    // Usamos el correo_usuario como parámetro para la consulta
    const [chats] = await db.query(listarChatsIntercambioQuery, [correo_usuario, correo_usuario]);

    if (chats.length === 0) {
      return res.status(404).json({ message: 'No se encontraron chats de intercambio.' });
    }

    res.status(200).json({ chats });
  } catch (error) {
    console.error('Error al listar los chats de intercambio:', error);
    return res.status(500).json({ error: 'Error al listar los chats de intercambio' });
  }
});

router.get('/obtener-id-cha/:id_estado', async (req, res) => {
  const { id_estado } = req.params;  // Obtienes el id_estado desde los parámetros de la URL
  const tipo_chat = 'intercambio';  // Tipo de chat fijo a 'intercambio'
  console.log(id_estado,tipo_chat)
  try {
    const query = `
      SELECT id_chat
      FROM chat
      WHERE id_estado = ? AND tipo_chat = ?
      LIMIT 1`;  // Limitamos la consulta a un solo chat

    const [rows] = await db.execute(query, [id_estado, tipo_chat]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró el id_chat con el estado y tipo de chat dados' });
    }

    res.status(200).json({ id_chat: rows[0].id_chat });
  } catch (error) {
    console.error('Error al obtener el id_chat:', error);
    res.status(500).json({ message: 'Error al obtener el id_chat' });
  }
});










return router;
}
