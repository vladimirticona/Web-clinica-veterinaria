# Test Plan v1 - Clínica Veterinaria

## Introducción
Este documento describe el plan de pruebas para validar la implementación de Domain-Driven Design (DDD) y Arquitectura Hexagonal en la aplicación de clínica veterinaria.

## Lenguaje Ubicuo (Ubiquitous Language)
- **Usuario**: Entidad que representa a un usuario del sistema con nombre, email, contraseña y rol.
- **Veterinario**: Entidad que representa a un profesional veterinario con especialidad, licencia, etc.
- **Mascota**: Entidad que representa a una mascota con especie, edad, sexo, etc.
- **Producto**: Entidad que representa productos disponibles en la clínica.
- **Reservación**: Entidad que representa una cita o reservación en la clínica.
- **Servicio**: Lógica de negocio que opera sobre las entidades.
- **Repositorio**: Puerto para acceso a datos.
- **Controlador**: Adaptador para interfaces externas.

## Contextos Acotados (Bounded Contexts)
- **Autenticación**: Gestión de usuarios y login.
- **Gestión de Veterinarios**: Administración de profesionales.
- **Gestión de Mascotas**: Manejo de pacientes animales.
- **Gestión de Productos**: Inventario de productos.
- **Reservaciones**: Programación de citas.

## Eventos de Dominio
- UsuarioRegistrado
- UsuarioAutenticado
- MascotaCreada
- ReservacionConfirmada
- ProductoAgregado

## Casos de Prueba

### Pruebas Unitarias de Value Objects
- Validación de email: formato correcto, presencia de @.
- Validación de contraseña: longitud mínima.
- Validación de nombre: no vacío, trim.

### Pruebas Unitarias de Entities
- Creación de Usuario: asignación correcta de propiedades, rol por defecto.
- Validación de Usuario: campos requeridos, formato email.
- Cambios de estado: cambiarNombre, cambiarEmail, etc.
- Creación de Veterinario: propiedades requeridas.
- Validación de Veterinario: campos obligatorios.
- Métodos de Veterinario: cambiarNombre, obtenerInformacionProfesional.

### Pruebas de Integración
- Creación de usuario completo: servicio + repositorio mock.
- Login: verificación de credenciales, generación de token.
- Gestión de veterinarios: CRUD operations.
- Agregados: Mascota con dueño y producto.

### Criterios de Validación
- Todas las pruebas deben pasar sin errores.
- Cobertura mínima del 80% en entidades y servicios.
- Aislamiento completo: uso de mocks para dependencias externas.
- Respeto a Arquitectura Hexagonal: interacción solo a través de puertos.