# ADR-001: Adopción de Arquitectura Hexagonal (Ports & Adapters)

## Estado
Aceptado

## Contexto
El sistema Mis Patitas comenzó con una arquitectura MVC tradicional en Ingeniería de Software I. Al escalar el proyecto en IS II, se identificó que la lógica de negocio estaba acoplada directamente a los controladores y a la base de datos, dificultando las pruebas unitarias y el mantenimiento.

## Decisión
Se adoptó la Arquitectura Hexagonal (Ports & Adapters) de Alistair Cockburn, separando el dominio de negocio de los adaptadores de infraestructura.

## Estructura adoptada
- `domain/entities/` — Entidades del negocio (Mascota, Reservacion, Producto)
- `domain/ports/` — Interfaces/contratos (IMascotaRepository, IAuthService)
- `application/services/` — Casos de uso (MascotaService, AuthService)
- `infrastructure/persistence/` — Adaptadores de BD (MySQLMascotaRepository)
- `infrastructure/http/` — Adaptadores HTTP (controllers, routes)

## Consecuencias
- Mayor facilidad para pruebas unitarias con mocks
- Independencia de la base de datos (se puede cambiar MySQL por otro motor)
- Mayor complejidad inicial pero mejor mantenibilidad a largo plazo