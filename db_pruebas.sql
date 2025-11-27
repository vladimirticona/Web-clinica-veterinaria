CREATE DATABASE db_pruebas;

USE db_pruebas;

CREATE TABLE pacientes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_mascota VARCHAR(100),
    raza VARCHAR(100),
    nombre_dueño VARCHAR(100)
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'usuario',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nombre_usuario, email, contraseña, rol) VALUES
('admin', 'admin@clinica.com', '$2a$10$SomeHashHere1', 'admin');