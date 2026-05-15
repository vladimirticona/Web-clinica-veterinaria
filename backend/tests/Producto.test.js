const Producto = require('../src/domain/entities/Producto');

describe('Producto Entity', () => {
  describe('Constructor', () => {
    test('debe crear un producto con todos los parámetros', () => {
      const productoData = { id: 1, nombre: 'Vacuna', precio: 50.0, cantidad: 100 };
      const producto = new Producto(productoData);
      expect(producto.id).toBe(1);
      expect(producto.nombre).toBe('Vacuna');
      expect(producto.precio).toBe(50.0);
      expect(producto.cantidad).toBe(100);
    });
  });

  describe('validar', () => {
    test('debe pasar validación con datos correctos', () => {
      const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50.0, cantidad: 100 });
      expect(() => producto.validar()).not.toThrow();
    });

    test('debe lanzar error si nombre está vacío', () => {
      const producto = new Producto({ id: 1, nombre: '', precio: 50.0, cantidad: 100 });
      expect(() => producto.validar()).toThrow('Faltan campos requeridos: nombre, precio');
    });

    test('debe lanzar error si precio es negativo', () => {
      const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: -10, cantidad: 100 });
      expect(() => producto.validar()).toThrow('El precio no puede ser negativo');
    });

    test('debe lanzar error si cantidad es negativa', () => {
      const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50.0, cantidad: -5 });
      expect(() => producto.validar()).toThrow('La cantidad no puede ser negativa');
    });
  });

  describe('reducirStock', () => {
    test('debe reducir el stock correctamente', () => {
      const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50.0, cantidad: 100 });
      producto.reducirStock(10);
      expect(producto.cantidad).toBe(90);
    });

    test('debe lanzar error si stock insuficiente', () => {
      const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50.0, cantidad: 10 });
      expect(() => producto.reducirStock(20)).toThrow('Stock insuficiente');
    });
  });

  describe('aumentarStock', () => {
    test('debe aumentar el stock correctamente', () => {
      const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50.0, cantidad: 100 });
      producto.aumentarStock(50);
      expect(producto.cantidad).toBe(150);
    });

    test('debe lanzar error si cantidad a aumentar es negativa', () => {
      const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50.0, cantidad: 100 });
      expect(() => producto.aumentarStock(-5)).toThrow('La cantidad a aumentar debe ser positiva');
    });
  });

  describe('cambiarPrecio', () => {
    test('debe cambiar el precio correctamente', () => {
      const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50.0, cantidad: 100 });
      producto.cambiarPrecio(60.0);
      expect(producto.precio).toBe(60.0);
    });

    test('debe lanzar error si precio es negativo', () => {
      const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50.0, cantidad: 100 });
      expect(() => producto.cambiarPrecio(-10)).toThrow('El precio no puede ser negativo');
    });
  });

  describe('cambiarNombre', () => {
    test('debe cambiar el nombre correctamente', () => {
      const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50.0, cantidad: 100 });
      producto.cambiarNombre('Vacuna Premium');
      expect(producto.nombre).toBe('Vacuna Premium');
    });

    test('debe trim el nombre', () => {
      const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50.0, cantidad: 100 });
      producto.cambiarNombre('  Vacuna Premium  ');
      expect(producto.nombre).toBe('Vacuna Premium');
    });

    test('debe lanzar error si nombre está vacío', () => {
      const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50.0, cantidad: 100 });
      expect(() => producto.cambiarNombre('')).toThrow('El nombre no puede estar vacío');
    });
  });

  describe('tieneStock', () => {
    test('debe retornar true si cantidad > 0', () => {
      const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50.0, cantidad: 10 });
      expect(producto.tieneStock()).toBe(true);
    });

    test('debe retornar false si cantidad = 0', () => {
      const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50.0, cantidad: 0 });
      expect(producto.tieneStock()).toBe(false);
    });
  });
});