# Architecture Decision Record: Refactorización Táctica del MVP

## Contexto
El sistema actual sufría de anemia de dominio, donde la lógica de negocio estaba dispersa en controladores y servicios, y las clases eran principalmente estructuras de datos con getters/setters. Se identificaron Value Objects existentes (Email, Precio, Dni, Telefono) pero faltaban entidades del dominio que encapsularan reglas de negocio.

Problema de integridad: Las mascotas y dueños se creaban sin validaciones consistentes, y no había encapsulación de reglas como "un dueño debe tener email válido".

## Decisión
Implementamos los Aggregate Roots "Mascota" y "Dueño", y confirmamos los Value Objects existentes (Email, Precio, Dni, Telefono).

- **Aggregate Root Mascota**: Encapsula la entidad Mascota con invariantes como la obligatoriedad de tener un dueño.
- **Aggregate Root Dueño**: Encapsula la entidad Dueño con validaciones de Value Objects.
- **Value Objects**: Email, Precio, Dni, Telefono como objetos de valor inmutables y validados.

## Justificación
Esta decisión asegura la protección de invariantes como "toda mascota debe tener un dueño" y "un dueño debe tener email y teléfono válidos" según los principios de Domain-Driven Design. Al hacer las entidades inmutables y validar en constructores, prevenimos estados inválidos y encapsulamos lógica de negocio.

Referencia: Implementing Domain-Driven Design (Vernon, 2013), donde se enfatiza la importancia de aggregates para mantener consistencia e invariantes.