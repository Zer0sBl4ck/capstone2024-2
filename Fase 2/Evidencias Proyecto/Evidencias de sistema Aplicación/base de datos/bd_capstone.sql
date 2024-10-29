-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 21-10-2024 a las 23:03:03
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bookshare`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `biblioteca_usuario`
--

CREATE TABLE `biblioteca_usuario` (
  `id_biblioteca` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `isbn` varchar(13) DEFAULT NULL,
  `disponible_prestamo` tinyint(1) DEFAULT NULL,
  `disponible_intercambio` tinyint(1) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat`
--

CREATE TABLE `chat` (
  `id_chat` int(11) NOT NULL,
  `id_biblioteca_usuario_ofertante` int(11) DEFAULT NULL,
  `id_biblioteca_usuario_solicitante` int(11) DEFAULT NULL,
  `tipo_chat` enum('prestamo','intercambio') NOT NULL,
  `id_estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `etiqueta`
--

CREATE TABLE `etiqueta` (
  `id_etiqueta` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `genero`
--

CREATE TABLE `genero` (
  `id_genero` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_intercambio`
--

CREATE TABLE `historial_intercambio` (
  `id_historial` int(11) NOT NULL,
  `isbn` varchar(13) DEFAULT NULL,
  `id_usuario_origen` int(11) DEFAULT NULL,
  `id_usuario_destino` int(11) DEFAULT NULL,
  `fecha_intercambio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `intercambio`
--

CREATE TABLE `intercambio` (
  `id_intercambio` int(11) NOT NULL,
  `id_usuario_ofertante` int(11) DEFAULT NULL,
  `id_usuario_solicitante` int(11) DEFAULT NULL,
  `id_biblioteca_prestamista` int(11) DEFAULT NULL,
  `id_biblioteca_solicitante` int(11) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro`
--

CREATE TABLE `libro` (
  `isbn` varchar(13) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `autor` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `genero` varchar(255) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `imagen_libro` blob DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro_etiqueta`
--

CREATE TABLE `libro_etiqueta` (
  `isbn` varchar(13) DEFAULT NULL,
  `id_etiqueta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro_genero`
--

CREATE TABLE `libro_genero` (
  `isbn` varchar(13) DEFAULT NULL,
  `id_genero` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lista_deseo_libro`
--

CREATE TABLE `lista_deseo_libro` (
  `id_lista` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `isbn` varchar(13) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensaje`
--

CREATE TABLE `mensaje` (
  `id_mensaje` int(11) NOT NULL,
  `id_chat` int(11) DEFAULT NULL,
  `id_usuario_remitente` int(11) DEFAULT NULL,
  `contenido` text DEFAULT NULL,
  `enviado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion`
--

CREATE TABLE `notificacion` (
  `id_notificacion` int(11) NOT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamo`
--

CREATE TABLE `prestamo` (
  `id_prestamo` int(11) NOT NULL,
  `id_usuario_solicitante` int(11) DEFAULT NULL,
  `id_usuario_prestamista` int(11) DEFAULT NULL,
  `id_biblioteca` int(11) DEFAULT NULL,
  `fecha_prestamo` date DEFAULT NULL,
  `estado_prestamo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resena`
--

CREATE TABLE `resena` (
  `id_resena` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `isbn` varchar(13) DEFAULT NULL,
  `calificacion` int(11) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre_usuario` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `rol` varchar(255) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `foto_perfil` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `biblioteca_usuario`
--
ALTER TABLE `biblioteca_usuario`
  ADD PRIMARY KEY (`id_biblioteca`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `isbn` (`isbn`);

--
-- Indices de la tabla `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id_chat`),
  ADD KEY `id_biblioteca_usuario_ofertante` (`id_biblioteca_usuario_ofertante`),
  ADD KEY `id_biblioteca_usuario_solicitante` (`id_biblioteca_usuario_solicitante`);

--
-- Indices de la tabla `etiqueta`
--
ALTER TABLE `etiqueta`
  ADD PRIMARY KEY (`id_etiqueta`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `genero`
--
ALTER TABLE `genero`
  ADD PRIMARY KEY (`id_genero`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `historial_intercambio`
--
ALTER TABLE `historial_intercambio`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `isbn` (`isbn`),
  ADD KEY `id_usuario_origen` (`id_usuario_origen`),
  ADD KEY `id_usuario_destino` (`id_usuario_destino`);

--
-- Indices de la tabla `intercambio`
--
ALTER TABLE `intercambio`
  ADD PRIMARY KEY (`id_intercambio`),
  ADD KEY `id_usuario_ofertante` (`id_usuario_ofertante`),
  ADD KEY `id_usuario_solicitante` (`id_usuario_solicitante`),
  ADD KEY `id_biblioteca_prestamista` (`id_biblioteca_prestamista`),
  ADD KEY `id_biblioteca_solicitante` (`id_biblioteca_solicitante`);

--
-- Indices de la tabla `libro`
--
ALTER TABLE `libro`
  ADD PRIMARY KEY (`isbn`);

--
-- Indices de la tabla `libro_etiqueta`
--
ALTER TABLE `libro_etiqueta`
  ADD KEY `isbn` (`isbn`),
  ADD KEY `id_etiqueta` (`id_etiqueta`);

--
-- Indices de la tabla `libro_genero`
--
ALTER TABLE `libro_genero`
  ADD KEY `isbn` (`isbn`),
  ADD KEY `id_genero` (`id_genero`);

--
-- Indices de la tabla `lista_deseo_libro`
--
ALTER TABLE `lista_deseo_libro`
  ADD PRIMARY KEY (`id_lista`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `isbn` (`isbn`);

--
-- Indices de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD PRIMARY KEY (`id_mensaje`),
  ADD KEY `id_chat` (`id_chat`),
  ADD KEY `id_usuario_remitente` (`id_usuario_remitente`);

--
-- Indices de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id_notificacion`);

--
-- Indices de la tabla `prestamo`
--
ALTER TABLE `prestamo`
  ADD PRIMARY KEY (`id_prestamo`),
  ADD KEY `id_usuario_solicitante` (`id_usuario_solicitante`),
  ADD KEY `id_usuario_prestamista` (`id_usuario_prestamista`),
  ADD KEY `id_biblioteca` (`id_biblioteca`);

--
-- Indices de la tabla `resena`
--
ALTER TABLE `resena`
  ADD PRIMARY KEY (`id_resena`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `isbn` (`isbn`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `biblioteca_usuario`
--
ALTER TABLE `biblioteca_usuario`
  MODIFY `id_biblioteca` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `chat`
--
ALTER TABLE `chat`
  MODIFY `id_chat` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `etiqueta`
--
ALTER TABLE `etiqueta`
  MODIFY `id_etiqueta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `genero`
--
ALTER TABLE `genero`
  MODIFY `id_genero` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historial_intercambio`
--
ALTER TABLE `historial_intercambio`
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `intercambio`
--
ALTER TABLE `intercambio`
  MODIFY `id_intercambio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `lista_deseo_libro`
--
ALTER TABLE `lista_deseo_libro`
  MODIFY `id_lista` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  MODIFY `id_mensaje` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `prestamo`
--
ALTER TABLE `prestamo`
  MODIFY `id_prestamo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `resena`
--
ALTER TABLE `resena`
  MODIFY `id_resena` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `biblioteca_usuario`
--
ALTER TABLE `biblioteca_usuario`
  ADD CONSTRAINT `biblioteca_usuario_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `biblioteca_usuario_ibfk_2` FOREIGN KEY (`isbn`) REFERENCES `libro` (`isbn`);

--
-- Filtros para la tabla `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`id_biblioteca_usuario_ofertante`) REFERENCES `biblioteca_usuario` (`id_biblioteca`),
  ADD CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`id_biblioteca_usuario_solicitante`) REFERENCES `biblioteca_usuario` (`id_biblioteca`);

--
-- Filtros para la tabla `historial_intercambio`
--
ALTER TABLE `historial_intercambio`
  ADD CONSTRAINT `historial_intercambio_ibfk_1` FOREIGN KEY (`isbn`) REFERENCES `libro` (`isbn`),
  ADD CONSTRAINT `historial_intercambio_ibfk_2` FOREIGN KEY (`id_usuario_origen`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `historial_intercambio_ibfk_3` FOREIGN KEY (`id_usuario_destino`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `intercambio`
--
ALTER TABLE `intercambio`
  ADD CONSTRAINT `intercambio_ibfk_1` FOREIGN KEY (`id_usuario_ofertante`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `intercambio_ibfk_2` FOREIGN KEY (`id_usuario_solicitante`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `intercambio_ibfk_3` FOREIGN KEY (`id_biblioteca_prestamista`) REFERENCES `biblioteca_usuario` (`id_biblioteca`),
  ADD CONSTRAINT `intercambio_ibfk_4` FOREIGN KEY (`id_biblioteca_solicitante`) REFERENCES `biblioteca_usuario` (`id_biblioteca`);

--
-- Filtros para la tabla `libro_etiqueta`
--
ALTER TABLE `libro_etiqueta`
  ADD CONSTRAINT `libro_etiqueta_ibfk_1` FOREIGN KEY (`isbn`) REFERENCES `libro` (`isbn`),
  ADD CONSTRAINT `libro_etiqueta_ibfk_2` FOREIGN KEY (`id_etiqueta`) REFERENCES `etiqueta` (`id_etiqueta`);

--
-- Filtros para la tabla `libro_genero`
--
ALTER TABLE `libro_genero`
  ADD CONSTRAINT `libro_genero_ibfk_1` FOREIGN KEY (`isbn`) REFERENCES `libro` (`isbn`),
  ADD CONSTRAINT `libro_genero_ibfk_2` FOREIGN KEY (`id_genero`) REFERENCES `genero` (`id_genero`);

--
-- Filtros para la tabla `lista_deseo_libro`
--
ALTER TABLE `lista_deseo_libro`
  ADD CONSTRAINT `lista_deseo_libro_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `lista_deseo_libro_ibfk_2` FOREIGN KEY (`isbn`) REFERENCES `libro` (`isbn`);

--
-- Filtros para la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD CONSTRAINT `mensaje_ibfk_1` FOREIGN KEY (`id_chat`) REFERENCES `chat` (`id_chat`),
  ADD CONSTRAINT `mensaje_ibfk_2` FOREIGN KEY (`id_usuario_remitente`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `prestamo`
--
ALTER TABLE `prestamo`
  ADD CONSTRAINT `prestamo_ibfk_1` FOREIGN KEY (`id_usuario_solicitante`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `prestamo_ibfk_2` FOREIGN KEY (`id_usuario_prestamista`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `prestamo_ibfk_3` FOREIGN KEY (`id_biblioteca`) REFERENCES `biblioteca_usuario` (`id_biblioteca`);

--
-- Filtros para la tabla `resena`
--
ALTER TABLE `resena`
  ADD CONSTRAINT `resena_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `resena_ibfk_2` FOREIGN KEY (`isbn`) REFERENCES `libro` (`isbn`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
