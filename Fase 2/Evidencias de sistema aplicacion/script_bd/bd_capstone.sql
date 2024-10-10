CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre_usuario VARCHAR(255),
  correo VARCHAR(255) UNIQUE,
  rol VARCHAR(255),
  contrasena VARCHAR(255),
  telefono VARCHAR(20),
  ubicacion VARCHAR(255),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  foto_perfil BLOB
);

CREATE TABLE libro (
  id_libro INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255),
  autor VARCHAR(255),
  descripcion VARCHAR(255),
  genero VARCHAR(255),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  imagen_libro BLOB
);

CREATE TABLE genero (
  id_genero INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) UNIQUE
);

CREATE TABLE libro_genero (
  id_libro INT,
  id_genero INT,
  FOREIGN KEY (id_libro) REFERENCES libro(id_libro),
  FOREIGN KEY (id_genero) REFERENCES genero(id_genero)
);

CREATE TABLE biblioteca_usuario (
  id_biblioteca INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  id_libro INT,
  disponible_prestamo BOOLEAN,
  disponible_intercambio BOOLEAN,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_libro) REFERENCES libro(id_libro)
);

CREATE TABLE intercambio (
  id_intercambio INT AUTO_INCREMENT PRIMARY KEY,
  id_libro INT,
  id_usuario_solicitante INT,
  id_usuario_intercambiador INT,
  fecha_intercambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(255),
  FOREIGN KEY (id_libro) REFERENCES libro(id_libro),
  FOREIGN KEY (id_usuario_solicitante) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_usuario_intercambiador) REFERENCES usuario(id_usuario)
);

CREATE TABLE historial_intercambio (
  id_historial INT AUTO_INCREMENT PRIMARY KEY,
  id_libro INT,
  id_usuario_origen INT,
  id_usuario_destino INT,
  fecha_intercambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_libro) REFERENCES libro(id_libro),
  FOREIGN KEY (id_usuario_origen) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_usuario_destino) REFERENCES usuario(id_usuario)
);

CREATE TABLE lista_deseo_libro (
  id_lista INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  id_libro INT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_libro) REFERENCES libro(id_libro)
);

CREATE TABLE prestamo (
  id_prestamo INT AUTO_INCREMENT PRIMARY KEY,
  id_libro INT,
  id_usuario_prestatario INT,
  id_usuario_prestamista INT,
  prestado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  devolucion_prevista TIMESTAMP,
  devuelto_en TIMESTAMP,
  estado VARCHAR(255),
  FOREIGN KEY (id_libro) REFERENCES libro(id_libro),
  FOREIGN KEY (id_usuario_prestatario) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_usuario_prestamista) REFERENCES usuario(id_usuario)
);

CREATE TABLE resena (
  id_resena INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  id_libro INT,
  calificacion INT,
  comentario TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_libro) REFERENCES libro(id_libro)
);

CREATE TABLE mensaje (
  id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario_remitente INT,
  id_usuario_receptor INT,
  contenido TEXT,
  enviado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario_remitente) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_usuario_receptor) REFERENCES usuario(id_usuario)
);

CREATE TABLE etiqueta (
  id_etiqueta INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) UNIQUE
);

CREATE TABLE libro_etiqueta (
  id_libro INT,
  id_etiqueta INT,
  FOREIGN KEY (id_libro) REFERENCES libro(id_libro),
  FOREIGN KEY (id_etiqueta) REFERENCES etiqueta(id_etiqueta)
);

CREATE TABLE notificacion (
  id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  contenido TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);
