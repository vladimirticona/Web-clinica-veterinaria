Feature: Registro de mascota
  Como veterinario
  Quiero registrar una mascota con los datos de su dueño
  Para mantener el historial clinico de cada paciente en el sistema

  Scenario: Registro exitoso de una mascota con todos los datos completos
    Given que el veterinario tiene los datos completos de la mascota y su dueño
    When solicita el registro de la mascota en el sistema
    Then el sistema confirma que la mascota fue registrada exitosamente
    And el historial clinico del paciente queda disponible en el sistema

  Scenario: Intento de registro de mascota con datos incompletos
    Given que el veterinario no cuenta con todos los datos requeridos de la mascota
    When solicita el registro de la mascota en el sistema
    Then el sistema rechaza el registro
    And notifica que faltan datos de la mascota para completar el registro