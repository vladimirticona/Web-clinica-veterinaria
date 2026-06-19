const { Given, When, Then } = require('../../backend/node_modules/@cucumber/cucumber');
const assert = require('assert');

const ReservacionService = require('../../backend/src/application/services/ReservacionService');

const mockReservacionRepository = {
  getAllConProductos: async () => [],
  getById: async () => null,
  create: async (datos) => ({ id: 1, ...datos }),
  update: async () => {},
  delete: async () => {}
};

const mockProductoRepository = {
  getById: async () => null,
  update: async () => {}
};

const reservacionService = new ReservacionService(mockReservacionRepository, mockProductoRepository);

Given('que el veterinario tiene los datos completos del cliente y la mascota para la cita', function () {
  this.datos = {
    nombre_cliente: 'Juan Perez',
    telefono: '999888777',
    email: 'juan@gmail.com',
    nombre_mascota: 'Firulais',
    especie: 'perro',
    motivo_consulta: 'Consulta general',
    fecha_solicitada: '2024-06-01',
    hora_solicitada: '10:00',
    tipo_cita: 'consulta'
  };
});

When('solicita el registro de la reservacion en el sistema', async function () {
  try {
    this.resultado = await reservacionService.crear(this.datos);
    this.error = null;
  } catch (error) {
    this.error = error;
    this.resultado = null;
  }
});

Then('el sistema confirma que la reservacion fue creada exitosamente', function () {
  assert.strictEqual(this.error, null);
  assert.strictEqual(this.resultado.nombre_cliente, 'Juan Perez');
});

Then('la cita queda registrada con estado pendiente en la agenda', function () {
  assert.strictEqual(this.resultado.estado, 'pendiente');
});

Given('que el veterinario no cuenta con todos los datos requeridos para la cita', function () {
  this.datos = {
    telefono: '999888777',
    email: 'juan@gmail.com'
  };
});

Then('el sistema rechaza la reservacion', function () {
  assert.notStrictEqual(this.error, null);
});

Then('notifica que faltan datos de la reservacion para completar el registro', function () {
  assert.ok(this.error.message.includes('requeridos'));
});