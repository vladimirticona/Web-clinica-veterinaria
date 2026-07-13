# ADR-002: Selección de Node.js y Express como Backend

## Estado
Aceptado

## Contexto
Se necesitaba un framework backend para construir la API REST del sistema veterinario.

## Decisión
Se eligió Node.js con Express.js como stack backend.

## Razones
- Ecosistema JavaScript unificado con el frontend React
- Alta velocidad de desarrollo con npm
- Amplia comunidad y documentación
- Compatible con arquitectura hexagonal

## Alternativas consideradas
- Django (Python) — descartado por cambio de lenguaje
- Spring Boot (Java) — descartado por complejidad para el equipo

## Consecuencias
- Curva de aprendizaje baja para el equipo
- Rendimiento adecuado para el volumen del sistema