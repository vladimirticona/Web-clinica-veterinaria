const Usuario = require('../src/domain/entities/Usuario');

describe('Usuario Entity', () => {
  describe('Constructor', () => {
    test('debe crear un usuario con todos los parámetros', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123', 'usuario');
      expect(usuario.id).toBe(1);
      expect(usuario.nombre).toBe('Juan Pérez');
      expect(usuario.email).toBe('juan@example.com');
      expect(usuario.password).toBe('password123');
      expect(usuario.rol).toBe('usuario');
    });

    test('debe asignar rol por defecto si no se proporciona', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123');
      expect(usuario.rol).toBe('usuario');
    });
  });

  describe('validar', () => {
    test('debe pasar validación con datos correctos', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123');
      expect(() => usuario.validar()).not.toThrow();
    });

    test('debe lanzar error si nombre está vacío', () => {
      const usuario = new Usuario(1, '', 'juan@example.com', 'password123');
      expect(() => usuario.validar()).toThrow('Nombre, email y password son requeridos');
    });

    test('debe lanzar error si email está vacío', () => {
      const usuario = new Usuario(1, 'Juan Pérez', '', 'password123');
      expect(() => usuario.validar()).toThrow('Nombre, email y password son requeridos');
    });

    test('debe lanzar error si password está vacío', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', '');
      expect(() => usuario.validar()).toThrow('Nombre, email y password son requeridos');
    });

    test('debe lanzar error si email no contiene @', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juanexample.com', 'password123');
      expect(() => usuario.validar()).toThrow('Email inválido');
    });
  });

  describe('cambiarNombre', () => {
    test('debe cambiar el nombre correctamente', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123');
      usuario.cambiarNombre('Carlos López');
      expect(usuario.nombre).toBe('Carlos López');
    });

    test('debe trim el nombre', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123');
      usuario.cambiarNombre('  Carlos López  ');
      expect(usuario.nombre).toBe('Carlos López');
    });

    test('debe lanzar error si nombre está vacío', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123');
      expect(() => usuario.cambiarNombre('')).toThrow('El nombre no puede estar vacío');
    });
  });

  describe('cambiarEmail', () => {
    test('debe cambiar el email correctamente', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123');
      usuario.cambiarEmail('carlos@example.com');
      expect(usuario.email).toBe('carlos@example.com');
    });

    test('debe convertir a minúsculas y trim', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123');
      usuario.cambiarEmail('  CARLOS@EXAMPLE.COM  ');
      expect(usuario.email).toBe('carlos@example.com');
    });

    test('debe lanzar error si email es inválido', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123');
      expect(() => usuario.cambiarEmail('invalidemail')).toThrow('Email inválido');
    });
  });

  describe('cambiarPassword', () => {
    test('debe cambiar la contraseña correctamente', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123');
      usuario.cambiarPassword('newpassword456');
      expect(usuario.password).toBe('newpassword456');
    });

    test('debe lanzar error si contraseña es demasiado corta', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123');
      expect(() => usuario.cambiarPassword('123')).toThrow('La contraseña debe tener al menos 6 caracteres');
    });
  });

  describe('cambiarRol', () => {
    test('debe cambiar el rol correctamente', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123');
      usuario.cambiarRol('admin');
      expect(usuario.rol).toBe('admin');
    });

    test('debe lanzar error si rol es inválido', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123');
      expect(() => usuario.cambiarRol('superuser')).toThrow('Rol inválido');
    });
  });

  describe('esAdmin', () => {
    test('debe retornar true si rol es admin', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123', 'admin');
      expect(usuario.esAdmin()).toBe(true);
    });

    test('debe retornar false si rol no es admin', () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'password123', 'usuario');
      expect(usuario.esAdmin()).toBe(false);
    });
  });
});