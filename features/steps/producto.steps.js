const { Given, When, Then } = require('../../backend/node_modules/@cucumber/cucumber');
const assert = require('assert');

const Producto = require('../../backend/src/domain/entities/Producto');

Given('que el veterinario selecciona un producto disponible en el inventario', function () {
  this.producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50, cantidad: 10 });
});

When('asocia el producto a la atencion de una mascota con una cantidad valida', function () {
  try {
    this.producto.reducirStock(3);
    this.error = null;
  } catch (error) {
    this.error = error;
  }
});

Then('el sistema confirma la reduccion del stock del producto', function () {
  assert.strictEqual(this.error, null);
});

Then('el inventario refleja la cantidad actualizada disponible', function () {
  assert.strictEqual(this.producto.cantidad, 7);
});

Given('que el veterinario selecciona un producto con stock limitado en el inventario', function () {
  this.producto = new Producto({ id: 1, nombre: 'Vacuna', precio: 50, cantidad: 5 });
});

When('solicita asociar una cantidad mayor a la disponible en el sistema', function () {
  try {
    this.producto.reducirStock(10);
    this.error = null;
  } catch (error) {
    this.error = error;
  }
});

Then('el sistema rechaza la operacion', function () {
  assert.notStrictEqual(this.error, null);
});

Then('notifica que no hay suficiente stock disponible para completar la atencion', function () {
  assert.ok(this.error.message.includes('Stock insuficiente'));
});