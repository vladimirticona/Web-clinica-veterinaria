# Guía de Práctica 6 — Archivos .feature Vinculados al MVP

## Historias de Usuario

**Historia 1:** Como veterinario, quiero registrar una mascota con los datos de su dueño para mantener el historial clinico de cada paciente en el sistema.

**Historia 2:** Como veterinario, quiero crear una reservacion de cita para un cliente, para organizar y gestionar la agenda de atenciones de la clinica.

**Historia 3:** Como veterinario, quiero gestionar el inventario de productos de la clinica, para garantizar que el stock este disponible al momento de atender a las mascotas.

## Tabla de Vinculación Arquitectónica

| Nombre del Escenario Gherkin | Puerto Primario / Caso de Uso Invocado | Técnica SWEBOK Aplicada |
|---|---|---|
| Registro exitoso de una mascota con todos los datos completos | IMascotaService.crear() | Caja Negra (Partición de Equivalencia) |
| Intento de registro de mascota con datos incompletos | IMascotaService.crear() | Caja Negra (Análisis de Valores Límite) |
| Creacion exitosa de una reservacion con todos los datos completos | IReservacionService.crear() | Caja Negra (Partición de Equivalencia) |
| Intento de creacion de reservacion con datos incompletos | IReservacionService.crear() | Caja Negra (Análisis de Valores Límite) |
| Reduccion exitosa de stock al asociar un producto a una atencion | Producto.reducirStock() | Caja Negra (Partición de Equivalencia) |
| Intento de reduccion de stock con cantidad mayor a la disponible | Producto.reducirStock() | Caja Negra (Análisis de Valores Límite) |

## Evidencia de la Ejecución

Se ejecutaron 6 escenarios completos contra la lógica real del MVP utilizando Cucumber.js, todos pasando exitosamente en verde. Los escenarios interactúan directamente con los puertos primarios de la arquitectura hexagonal sin pasar por controladores HTTP ni interfaz gráfica, garantizando pruebas desacopladas y resistentes a cambios visuales.