const Mascota = require('../../src/domain/entities/Mascota');

describe('Mascota', () => {
  test('CP01 - crear mascota con datos correctos', () => {
    const mascota = new Mascota({
      nombre: 'Firulais',
      especie: 'Perro',
      edad: 3,
      sexo: 'Macho',
      id_dueño: 1
    });
    expect(mascota.nombre).toBe('Firulais');
    expect(mascota.especie).toBe('perro');
  });

  test('CP02 - crear mascota sin nombre debe lanzar error', () => {
    const mascota = new Mascota({
      especie: 'Perro',
      edad: 3,
      sexo: 'Macho',
      id_dueño: 1
    });
    expect(() => mascota.validar()).toThrow('Faltan campos requeridos');
  });

  test('CP03 - crear mascota sin especie debe lanzar error', () => {
    const mascota = new Mascota({
      nombre: 'Firulais',
      edad: 3,
      sexo: 'Macho',
      id_dueño: 1
    });
    expect(() => mascota.validar()).toThrow('Faltan campos requeridos');
  });

  test('CP04 - especie debe guardarse en minusculas', () => {
    const mascota = new Mascota({
      nombre: 'Firulais',
      especie: 'PERRO',
      edad: 3,
      sexo: 'Macho',
      id_dueño: 1
    });
    expect(mascota.especie).toBe('perro');
  });
});