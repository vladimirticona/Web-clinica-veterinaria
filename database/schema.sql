-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-07-2026 a las 06:03:11
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
-- Base de datos: `db_pruebas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dueños`
--

CREATE TABLE `dueños` (
  `id` int(11) NOT NULL,
  `nombre_completo` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `dueños`
--

INSERT INTO `dueños` (`id`, `nombre_completo`, `telefono`, `email`, `fecha_creacion`) VALUES
(1, 'Juan Perez', '987456123', 'juan@gmail.com', '2025-12-03 18:14:41'),
(2, 'Italo Flores', '987777555', 'italo@gmail.com', '2025-12-03 18:18:31'),
(3, 'Roberto Perez', '987000555', 'robertop@gmail.com', '2025-12-04 05:45:57'),
(4, 'Daniela Sanchez', '999888776', 'danielas@gmail.com', '2025-12-04 05:49:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascotas`
--

CREATE TABLE `mascotas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `especie` varchar(100) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `sexo` enum('Macho','Hembra') DEFAULT NULL,
  `motivo` text DEFAULT NULL,
  `producto_adicional_id` int(11) DEFAULT NULL,
  `cantidad_producto` int(11) DEFAULT NULL,
  `id_dueño` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mascotas`
--

INSERT INTO `mascotas` (`id`, `nombre`, `especie`, `edad`, `sexo`, `motivo`, `producto_adicional_id`, `cantidad_producto`, `id_dueño`, `fecha_creacion`) VALUES
(1, 'Max', 'perro', 3, 'Macho', 'Revision general', NULL, NULL, 1, '2025-12-03 18:14:41'),
(2, 'Thor', 'perro', 2, 'Macho', 'Revision general', 3, 3, 2, '2025-12-03 18:18:31'),
(3, 'Toby', 'perro', 4, 'Macho', 'Revision general', 2, 5, 3, '2025-12-04 05:45:57'),
(4, 'Luna', 'gato', 2, 'Hembra', 'Revision general', NULL, NULL, 4, '2025-12-04 05:49:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `cantidad` int(11) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `precio`, `cantidad`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Champu para gatos', 20.00, 50, '2025-12-03 18:15:17', '2025-12-03 18:15:17'),
(2, 'Champu para perros', 15.00, 45, '2025-12-03 18:17:09', '2025-12-04 05:45:57'),
(3, 'Correa para perros', 20.00, 4, '2025-12-03 18:17:32', '2025-12-03 18:20:20'),
(4, 'Cama grande para perros', 50.00, 50, '2025-12-04 05:47:18', '2025-12-04 05:47:18'),
(5, 'Cama mediana para perros', 35.00, 60, '2025-12-04 05:47:36', '2025-12-04 05:47:36'),
(6, 'Cama pequeña para perros', 25.00, 8, '2025-12-04 05:47:51', '2025-12-04 05:47:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservaciones`
--

CREATE TABLE `reservaciones` (
  `id` int(11) NOT NULL,
  `nombre_cliente` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nombre_mascota` varchar(100) DEFAULT NULL,
  `especie` varchar(50) DEFAULT NULL,
  `motivo_consulta` text DEFAULT NULL,
  `fecha_solicitada` date DEFAULT NULL,
  `hora_solicitada` time DEFAULT NULL,
  `tipo_cita` enum('presencial','domicilio') DEFAULT NULL,
  `estado` enum('pendiente','confirmada','cancelada','reprogramar') DEFAULT 'pendiente',
  `producto_adicional_id` int(11) DEFAULT NULL,
  `cantidad_producto` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `reservaciones`
--

INSERT INTO `reservaciones` (`id`, `nombre_cliente`, `telefono`, `email`, `nombre_mascota`, `especie`, `motivo_consulta`, `fecha_solicitada`, `hora_solicitada`, `tipo_cita`, `estado`, `producto_adicional_id`, `cantidad_producto`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Maria Gonzalez', '987555222', 'maria@gmail.com', 'Rocky', 'perro', 'Revision general', '2025-12-04', '13:15:00', 'presencial', 'confirmada', NULL, 1, '2025-12-03 18:16:04', '2025-12-03 18:16:23'),
(2, 'Juan Gomez', '987755000', 'juang@gmail.com', 'Boby', 'perro', 'Revision general', '2025-12-04', '15:20:00', 'presencial', 'pendiente', 3, 1, '2025-12-03 18:20:20', '2025-12-03 18:20:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` varchar(50) DEFAULT 'usuario',
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_completo`, `email`, `contraseña`, `rol`, `activo`, `fecha_creacion`) VALUES
(1, 'Carlos Alberto', 'carlos369@gmail.com', '$2b$10$NyaNLMsXUaDIVosZj8V5pu8fhop7BFv.8Q733hf2Hccz1KqpkfmYO', 'usuario', 1, '2025-12-03 18:13:49'),
(2, 'carlos', 'carlos@gmail.com', '$2b$10$ATWk/z8TRORuHqs9DYKKhuNtdIEeykXiXVzugbb51CubG0ZpGFcZi', 'usuario', 1, '2026-05-28 16:00:26');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `dueños`
--
ALTER TABLE `dueños`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_dueño` (`id_dueño`),
  ADD KEY `idx_producto` (`producto_adicional_id`),
  ADD KEY `idx_mascota_dueño` (`id_dueño`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `reservaciones`
--
ALTER TABLE `reservaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_fecha` (`fecha_solicitada`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_producto` (`producto_adicional_id`),
  ADD KEY `idx_reservacion_fecha` (`fecha_solicitada`),
  ADD KEY `idx_reservacion_estado` (`estado`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_usuario_email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `dueños`
--
ALTER TABLE `dueños`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `reservaciones`
--
ALTER TABLE `reservaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD CONSTRAINT `mascotas_ibfk_1` FOREIGN KEY (`id_dueño`) REFERENCES `dueños` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mascotas_ibfk_2` FOREIGN KEY (`producto_adicional_id`) REFERENCES `productos` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `reservaciones`
--
ALTER TABLE `reservaciones`
  ADD CONSTRAINT `reservaciones_ibfk_1` FOREIGN KEY (`producto_adicional_id`) REFERENCES `productos` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
