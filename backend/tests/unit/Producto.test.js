const Producto = require('../../src/domain/entities/Producto');

describe('Producto', () => {
  test('CP10 - crear producto con datos correctos', () => {
    const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50, cantidad: 10 });
    expect(producto.nombre).toBe('Vacuna');
    expect(producto.cantidad).toBe(10);
  });

  test('CP11 - reducir stock con cantidad valida', () => {
    const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50, cantidad: 10 });
    producto.reducirStock(3);
    expect(producto.cantidad).toBe(7);
  });

  test('CP12 - reducir stock por debajo de cero debe lanzar error', () => {
    const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50, cantidad: 5 });
    expect(() => producto.reducirStock(10)).toThrow('Stock insuficiente');
  });

  test('CP13 - crear producto sin nombre debe lanzar error', () => {
    const producto = new Producto({ id: 1, precio: 50, cantidad: 10 });
    expect(() => producto.validar()).toThrow('Faltan campos requeridos');
  });

  test('CP14 - crear producto sin precio debe lanzar error', () => {
    const producto = new Producto({ id: 1, nombre: 'Vacuna', cantidad: 10 });
    expect(() => producto.validar()).toThrow('Faltan campos requeridos');
  });

  test('CP - reducir stock con cantidad exactamente igual al stock debe lanzar error (valor limite)', () => {
    const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50, cantidad: 5 });
    expect(() => producto.reducirStock(5)).not.toThrow();
    expect(producto.cantidad).toBe(0);
  });

  test('CP - reducir stock con cantidad mayor en uno al stock debe lanzar error (valor limite)', () => {
    const producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50, cantidad: 5 });
    expect(() => producto.reducirStock(6)).toThrow('Stock insuficiente');
  });

  test('CP - crear producto sin nombre ni precio debe lanzar error', () => {
    const producto = new Producto({ id: 1, cantidad: 10 });
    expect(() => producto.validar()).toThrow('Faltan campos requeridos');
  });
});