# ADR-003: Selección de MySQL como Motor de Base de Datos

## Estado
Aceptado

## Contexto
Se requería una base de datos relacional para almacenar mascotas, dueños, reservaciones y productos con relaciones entre ellos.

## Decisión
Se eligió MySQL como motor de base de datos relacional.

## Razones
- Relaciones claras entre entidades (mascotas-dueños, reservaciones-productos)
- Familiaridad del equipo con SQL
- Integración sencilla con Node.js mediante el paquete `mysql`
- Disponible en XAMPP para desarrollo local

## Consecuencias
- Gracias a la arquitectura hexagonal, el motor puede reemplazarse sin modificar la lógica de dominio