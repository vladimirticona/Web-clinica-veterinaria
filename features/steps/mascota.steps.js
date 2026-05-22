const { Given, When, Then } = require('../../backend/node_modules/@cucumber/cucumber');
const assert = require('assert');

const Mascota = require('../../backend/src/domain/entities/Mascota');
const MascotaService = require('../../backend/src/application/services/MascotaService');

const mockMascotaRepository = {
  getMascotasConDueños: async () => [],
  getMascotaConDueño: async () => null,
  getById: async () => null,
  create: async (datos) => ({ id: 1, ...datos }),
  update: async () => {},
  delete: async () => {}
};

const mockDueñoRepository = {
  create: async () => ({ id: 1, nombre_completo: 'Juan Perez' })
};

const mockProductoRepository = {
  getById: async () => null,
  update: async () => {}
};

const mascotaService = new MascotaService(mockMascotaRepository, mockDueñoRepository, mockProductoRepository);

Given('que el veterinario tiene los datos completos de la mascota y su dueño', function () {
  this.datos = {
    nombre: 'Firulais',
    especie: 'perro',
    edad: 3,
    sexo: 'Macho',
    nombre_dueño: 'Juan Perez',
    telefono: '999888777',
    email: 'juan@gmail.com'
  };
});

When('solicita el registro de la mascota en el sistema', async function () {
  try {
    this.resultado = await mascotaService.crear(this.datos);
    this.error = null;
  } catch (error) {
    this.error = error;
    this.resultado = null;
  }
});

Then('el sistema confirma que la mascota fue registrada exitosamente', function () {
  assert.strictEqual(this.error, null);
  assert.strictEqual(this.resultado.mascota.nombre, 'Firulais');
});

Then('el historial clinico del paciente queda disponible en el sistema', function () {
  assert.strictEqual(this.resultado.dueño.id, 1);
});

Given('que el veterinario no cuenta con todos los datos requeridos de la mascota', function () {
  this.datos = {
    especie: 'perro',
    edad: 3,
    sexo: 'Macho'
  };
});

Then('el sistema rechaza el registro', function () {
  assert.notStrictEqual(this.error, null);
});

Then('notifica que faltan datos de la mascota para completar el registro', function () {
  assert.ok(this.error.message.includes('requeridos'));
});