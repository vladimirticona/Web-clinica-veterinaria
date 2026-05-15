const Mascota = require('../src/domain/entities/Mascota');

describe('Mascota Entity', () => {
  describe('Constructor', () => {
    test('debe crear una mascota con todos los parámetros', () => {
      const mascotaData = {
        id: 1,
        nombre: 'Firulais',
        especie: 'Perro',
        edad: 3,
        sexo: 'Macho',
        motivo: 'Vacunación',
        id_dueño: 1,
        producto_adicional_id: 2,
        cantidad_producto: 1
      };
      const mascota = new Mascota(mascotaData);
      expect(mascota.id).toBe(1);
      expect(mascota.nombre).toBe('Firulais');
      expect(mascota.especie).toBe('perro');
      expect(mascota.edad).toBe(3);
      expect(mascota.sexo).toBe('Macho');
      expect(mascota.motivo).toBe('Vacunación');
      expect(mascota.id_dueño).toBe(1);
      expect(mascota.producto_adicional_id).toBe(2);
      expect(mascota.cantidad_producto).toBe(1);
    });

    test('debe convertir especie a minúsculas', () => {
      const mascota = new Mascota({ id: 1, nombre: 'Michi', especie: 'GATO', edad: 2, sexo: 'Hembra' });
      expect(mascota.especie).toBe('gato');
    });
  });

  describe('validar', () => {
    test('debe pasar validación con datos correctos', () => {
      const mascota = new Mascota({ id: 1, nombre: 'Firulais', especie: 'Perro', edad: 3, sexo: 'Macho' });
      expect(() => mascota.validar()).not.toThrow();
    });

    test('debe lanzar error si nombre está vacío', () => {
      const mascota = new Mascota({ id: 1, nombre: '', especie: 'Perro', edad: 3, sexo: 'Macho' });
      expect(() => mascota.validar()).toThrow('Faltan campos requeridos: nombre, especie, edad, sexo');
    });

    test('debe lanzar error si especie está vacío', () => {
      const mascota = new Mascota({ id: 1, nombre: 'Firulais', especie: '', edad: 3, sexo: 'Macho' });
      expect(() => mascota.validar()).toThrow('Faltan campos requeridos: nombre, especie, edad, sexo');
    });

    test('debe lanzar error si edad es negativa', () => {
      const mascota = new Mascota({ id: 1, nombre: 'Firulais', especie: 'Perro', edad: -1, sexo: 'Macho' });
      expect(() => mascota.validar()).toThrow('La edad no puede ser negativa');
    });
  });

  describe('cambiarNombre', () => {
    test('debe cambiar el nombre correctamente', () => {
      const mascota = new Mascota({ id: 1, nombre: 'Firulais', especie: 'Perro', edad: 3, sexo: 'Macho' });
      mascota.cambiarNombre('Rex');
      expect(mascota.nombre).toBe('Rex');
    });

    test('debe trim el nombre', () => {
      const mascota = new Mascota({ id: 1, nombre: 'Firulais', especie: 'Perro', edad: 3, sexo: 'Macho' });
      mascota.cambiarNombre('  Rex  ');
      expect(mascota.nombre).toBe('Rex');
    });

    test('debe lanzar error si nombre está vacío', () => {
      const mascota = new Mascota({ id: 1, nombre: 'Firulais', especie: 'Perro', edad: 3, sexo: 'Macho' });
      expect(() => mascota.cambiarNombre('')).toThrow('El nombre no puede estar vacío');
    });
  });

  describe('cambiarMotivo', () => {
    test('debe cambiar el motivo correctamente', () => {
      const mascota = new Mascota({ id: 1, nombre: 'Firulais', especie: 'Perro', edad: 3, sexo: 'Macho', motivo: 'Vacunación' });
      mascota.cambiarMotivo('Consulta general');
      expect(mascota.motivo).toBe('Consulta general');
    });
  });

  describe('asignarProducto', () => {
    test('debe asignar producto correctamente', () => {
      const mascota = new Mascota({ id: 1, nombre: 'Firulais', especie: 'Perro', edad: 3, sexo: 'Macho' });
      mascota.asignarProducto(5, 2);
      expect(mascota.producto_adicional_id).toBe(5);
      expect(mascota.cantidad_producto).toBe(2);
    });
  });

  describe('esAdulto', () => {
    test('debe retornar true si edad > 1', () => {
      const mascota = new Mascota({ id: 1, nombre: 'Firulais', especie: 'Perro', edad: 3, sexo: 'Macho' });
      expect(mascota.esAdulto()).toBe(true);
    });

    test('debe retornar false si edad <= 1', () => {
      const mascota = new Mascota({ id: 1, nombre: 'Firulais', especie: 'Perro', edad: 1, sexo: 'Macho' });
      expect(mascota.esAdulto()).toBe(false);
    });
  });

  describe('obtenerInformacionBasica', () => {
    test('debe retornar la información básica', () => {
      const mascota = new Mascota({ id: 1, nombre: 'Firulais', especie: 'Perro', edad: 3, sexo: 'Macho' });
      const info = mascota.obtenerInformacionBasica();
      expect(info).toEqual({
        id: 1,
        nombre: 'Firulais',
        especie: 'perro',
        edad: 3,
        sexo: 'Macho'
      });
    });
  });
});