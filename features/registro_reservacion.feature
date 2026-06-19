Feature: Registro de reservacion
  Como veterinario
  Quiero crear una reservacion de cita para un cliente
  Para organizar y gestionar la agenda de atenciones de la clinica

  Scenario: Creacion exitosa de una reservacion con todos los datos completos
    Given que el veterinario tiene los datos completos del cliente y la mascota para la cita
    When solicita el registro de la reservacion en el sistema
    Then el sistema confirma que la reservacion fue creada exitosamente
    And la cita queda registrada con estado pendiente en la agenda

  Scenario: Intento de creacion de reservacion con datos incompletos
    Given que el veterinario no cuenta con todos los datos requeridos para la cita
    When solicita el registro de la reservacion en el sistema
    Then el sistema rechaza la reservacion
    And notifica que faltan datos de la reservacion para completar el registro
