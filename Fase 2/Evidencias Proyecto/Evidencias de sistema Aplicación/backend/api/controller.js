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
  const { id_usuario, isbn } = req.body; // Cambiar id_libro a isbn

  const query = `
    INSERT INTO biblioteca_usuario (id_usuario, isbn, disponible_prestamo, disponible_intercambio)
    VALUES (?, ?, false, false)  -- Establece los valores predeterminados como false
  `;

  db.query(query, [id_usuario, isbn], (error, results) => {
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

router.get('/personas-con-libro/:isbn', async (req, res) => {
  const isbn = req.params.isbn; // Obtener el ISBN del parámetro de la ruta
  console.log(`Recibiendo solicitud para listar personas con el libro ISBN: ${isbn}`);

  const query = `
    SELECT 
      usuario.id_usuario, 
      usuario.nombre_usuario, 
      usuario.correo, 
      usuario.ubicacion, 
      usuario.telefono, 
      TO_BASE64(usuario.foto_perfil) AS foto_perfil_base64,  -- Alias para el campo Base64
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
  `;

  try {
    const [results] = await db.query(query, [isbn]);
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
    VALUES (?, ?, ?, CURDATE(), 'pendiente')
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

router.post('/notificacion_prestamo', (req, res) => {
  const { correo, titulo, descripcion } = req.body; // Cambié 'correo_prestamista' a 'correo'
  // Validar que los campos requeridos estén presentes
  if (!correo || !titulo || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  // Paso 1: Insertar la notificación en la tabla 'notificacion'
  const insertNotificacionQuery = `
    INSERT INTO notificacion (correo, titulo, descripcion) 
    VALUES (?, ?, ?)
  `;

  db.query(insertNotificacionQuery, [correo, titulo, descripcion], (error, result) => {
    if (error) {
      console.error('Error al insertar la notificación:', error);
      return res.status(500).json({ error: 'Error al insertar la notificación' });
    }

    console.log('Notificación insertada con éxito:', result);
    return res.status(200).json({ message: 'Notificación insertada con éxito' });
  });
});
router.get('/ps/:correo', async (req, res) => {
  const { correo } = req.params;

  if (!correo) {
    return res.status(400).json({ error: 'El correo del usuario es requerido.' });
  }

  // Consulta para obtener las solicitudes de préstamo donde el correo coincide con el prestamista
  const getSolicitudesQuery = `
    SELECT p.id_prestamo, p.id_usuario_solicitante, p.id_usuario_prestamista, p.id_biblioteca, 
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
    SELECT p.id_prestamo, p.id_usuario_solicitante, p.id_usuario_prestamista, p.id_biblioteca, 
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
           u1.correo AS correo_usuario_prestamista, 
           u2.correo AS correo_usuario_solicitante
    FROM chat c
    JOIN prestamo p ON c.id_estado = p.id_prestamo
    LEFT JOIN usuario u1 ON p.id_usuario_prestamista = u1.id_usuario
    LEFT JOIN usuario u2 ON p.id_usuario_solicitante = u2.id_usuario
    WHERE (u1.correo = ? OR u2.correo = ?) 
    AND c.tipo_chat = 'prestamo'  -- Filtrar solo por chats de tipo 'prestamo'
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

return router;
}
