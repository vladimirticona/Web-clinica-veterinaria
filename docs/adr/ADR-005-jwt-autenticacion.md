# ADR-005: Uso de JWT para Autenticación

## Estado
Aceptado

## Contexto
El sistema requería un mecanismo de autenticación para proteger los endpoints de la API.

## Decisión
Se eligió JSON Web Tokens (JWT) para la autenticación stateless.

## Razones
- Sin estado en el servidor (stateless)
- Compatible con arquitecturas REST
- Fácil integración con React en el frontend
- Soporte nativo con la librería `jsonwebtoken`

## Consecuencias
- Los tokens expiran en 24 horas por seguridad
- Las contraseñas se almacenan con hash bcrypt
- No se requiere sesión en el servidor