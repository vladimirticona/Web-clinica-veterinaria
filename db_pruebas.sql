CREATE DATABASE db_pruebas;

USE db_pruebas;

CREATE TABLE pacientes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_mascota VARCHAR(100),
    raza VARCHAR(100),
    nombre_dueño VARCHAR(100)
);