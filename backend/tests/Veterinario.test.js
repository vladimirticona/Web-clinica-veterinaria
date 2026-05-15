const Veterinario = require('../src/domain/entities/Veterinario');

describe('Veterinario Entity', () => {
  describe('Constructor', () => {
    test('debe crear un veterinario con todos los parámetros', () => {
      const vet = new Veterinario(1, 'Dr. Juan Pérez', 'Cirugía', '123456789', 'juan@example.com', 'LIC123');
      expect(vet.id).toBe(1);
      expect(vet.nombre).toBe('Dr. Juan Pérez');
      expect(vet.especialidad).toBe('Cirugía');
      expect(vet.telefono).toBe('123456789');
      expect(vet.email).toBe('juan@example.com');
      expect(vet.licencia).toBe('LIC123');
    });
  });

  describe('validar', () => {
    test('debe pasar validación con datos correctos', () => {
      const vet = new Veterinario(1, 'Dr. Juan Pérez', 'Cirugía', '123456789', 'juan@example.com', 'LIC123');
      expect(() => vet.validar()).not.toThrow();
    });

    test('debe lanzar error si nombre está vacío', () => {
      const vet = new Veterinario(1, '', 'Cirugía', '123456789', 'juan@example.com', 'LIC123');
      expect(() => vet.validar()).toThrow('Nombre, especialidad y licencia son requeridos');
    });

    test('debe lanzar error si especialidad está vacío', () => {
      const vet = new Veterinario(1, 'Dr. Juan Pérez', '', '123456789', 'juan@example.com', 'LIC123');
      expect(() => vet.validar()).toThrow('Nombre, especialidad y licencia son requeridos');
    });

    test('debe lanzar error si licencia está vacío', () => {
      const vet = new Veterinario(1, 'Dr. Juan Pérez', 'Cirugía', '123456789', 'juan@example.com', '');
      expect(() => vet.validar()).toThrow('Nombre, especialidad y licencia son requeridos');
    });

    test('debe lanzar error si email no contiene @', () => {
      const vet = new Veterinario(1, 'Dr. Juan Pérez', 'Cirugía', '123456789', 'juanexample.com', 'LIC123');
      expect(() => vet.validar()).toThrow('Email inválido');
    });
  });

  describe('cambiarNombre', () => {
    test('debe cambiar el nombre correctamente', () => {
      const vet = new Veterinario(1, 'Dr. Juan Pérez', 'Cirugía', '123456789', 'juan@example.com', 'LIC123');
      vet.cambiarNombre('Dr. Carlos López');
      expect(vet.nombre).toBe('Dr. Carlos López');
    });

    test('debe trim el nombre', () => {
      const vet = new Veterinario(1, 'Dr. Juan Pérez', 'Cirugía', '123456789', 'juan@example.com', 'LIC123');
      vet.cambiarNombre('  Dr. Carlos López  ');
      expect(vet.nombre).toBe('Dr. Carlos López');
    });

    test('debe lanzar error si nombre está vacío', () => {
      const vet = new Veterinario(1, 'Dr. Juan Pérez', 'Cirugía', '123456789', 'juan@example.com', 'LIC123');
      expect(() => vet.cambiarNombre('')).toThrow('El nombre no puede estar vacío');
    });
  });

  describe('cambiarTelefono', () => {
    test('debe cambiar el teléfono correctamente', () => {
      const vet = new Veterinario(1, 'Dr. Juan Pérez', 'Cirugía', '123456789', 'juan@example.com', 'LIC123');
      vet.cambiarTelefono('987654321');
      expect(vet.telefono).toBe('987654321');
    });
  });

  describe('cambiarEmail', () => {
    test('debe cambiar el email correctamente', () => {
      const vet = new Veterinario(1, 'Dr. Juan Pérez', 'Cirugía', '123456789', 'juan@example.com', 'LIC123');
      vet.cambiarEmail('carlos@example.com');
      expect(vet.email).toBe('carlos@example.com');
    });

    test('debe convertir a minúsculas y trim', () => {
      const vet = new Veterinario(1, 'Dr. Juan Pérez', 'Cirugía', '123456789', 'juan@example.com', 'LIC123');
      vet.cambiarEmail('  CARLOS@EXAMPLE.COM  ');
      expect(vet.email).toBe('carlos@example.com');
    });

    test('debe lanzar error si email es inválido', () => {
      const vet = new Veterinario(1, 'Dr. Juan Pérez', 'Cirugía', '123456789', 'juan@example.com', 'LIC123');
      expect(() => vet.cambiarEmail('invalidemail')).toThrow('Email inválido');
    });
  });

  describe('obtenerInformacionProfesional', () => {
    test('debe retornar la información profesional completa', () => {
      const vet = new Veterinario(1, 'Dr. Juan Pérez', 'Cirugía', '123456789', 'juan@example.com', 'LIC123');
      const info = vet.obtenerInformacionProfesional();
      expect(info).toEqual({
        id: 1,
        nombre: 'Dr. Juan Pérez',
        especialidad: 'Cirugía',
        telefono: '123456789',
        email: 'juan@example.com',
        licencia: 'LIC123'
      });
    });
  });
});