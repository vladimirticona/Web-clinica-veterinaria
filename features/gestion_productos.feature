Feature: Gestion de productos
  Como veterinario
  Quiero gestionar el inventario de productos de la clinica
  Para garantizar que el stock este disponible al momento de atender a las mascotas

  Scenario: Reduccion exitosa de stock al asociar un producto a una atencion
    Given que el veterinario selecciona un producto disponible en el inventario
    When asocia el producto a la atencion de una mascota con una cantidad valida
    Then el sistema confirma la reduccion del stock del producto
    And el inventario refleja la cantidad actualizada disponible

  Scenario: Intento de reduccion de stock con cantidad mayor a la disponible
    Given que el veterinario selecciona un producto con stock limitado en el inventario
    When solicita asociar una cantidad mayor a la disponible en el sistema
    Then el sistema rechaza la operacion
    And notifica que no hay suficiente stock disponible para completar la atencion