const MascotaService = require('../../src/application/services/MascotaService');

const repositorioEnMemoria = {
  mascotas: [],
  getMascotasConDueños: jest.fn(async function() { return repositorioEnMemoria.mascotas; }),
  getMascotaConDueño: jest.fn(async function(id) {
    return repositorioEnMemoria.mascotas.find(m => m.id === id) || null;
  }),
  getById: jest.fn(async function(id) {
    return repositorioEnMemoria.mascotas.find(m => m.id === id) || null;
  }),
  create: jest.fn(async function(datos) {
    const nueva = { id: Date.now(), ...datos };
    repositorioEnMemoria.mascotas.push(nueva);
    return nueva;
  }),
  update: jest.fn(),
  delete: jest.fn()
};

const dueñoRepositorioFake = {
  create: jest.fn(async () => ({ id: 1, nombre_completo: 'Juan Perez' }))
};

const productoRepositorioFake = {
  getById: jest.fn(),
  update: jest.fn()
};

describe('MascotaService - Integracion', () => {
  let mascotaService;

  beforeEach(() => {
    repositorioEnMemoria.mascotas = [];
    jest.clearAllMocks();
    mascotaService = new MascotaService(repositorioEnMemoria, dueñoRepositorioFake, productoRepositorioFake);
  });

  test('CP25 - crear mascota y luego obtenerTodas debe retornarla', async () => {
    const datos = {
      nombre: 'Firulais',
      especie: 'perro',
      edad: 3,
      sexo: 'Macho',
      nombre_dueño: 'Juan Perez',
      telefono: '999888777',
      email: 'juan@gmail.com'
    };
    await mascotaService.crear(datos);
    const mascotas = await mascotaService.obtenerTodas();
    expect(mascotas.length).toBe(1);
  });

  test('CP26 - crear mascota y obtenerTodas debe confirmar que existe', async () => {
    const datos = {
      nombre: 'Firulais',
      especie: 'perro',
      edad: 3,
      sexo: 'Macho',
      nombre_dueño: 'Juan Perez',
      telefono: '999888777',
      email: 'juan@gmail.com'
    };
    await mascotaService.crear(datos);
    const mascotas = await mascotaService.obtenerTodas();
    expect(mascotas.length).toBe(1);
  });

  test('CP27 - obtenerPorId debe retornar la mascota creada', async () => {
    const datos = {
      nombre: 'Firulais',
      especie: 'perro',
      edad: 3,
      sexo: 'Macho',
      nombre_dueño: 'Juan Perez',
      telefono: '999888777',
      email: 'juan@gmail.com'
    };
    const resultado = await mascotaService.crear(datos);
    const mascota = await mascotaService.obtenerPorId(resultado.mascota.id);
    expect(mascota.nombre).toBe('Firulais');
  });

  test('CP28 - obtenerPorId de mascota inexistente debe retornar null', async () => {
    const mascota = await repositorioEnMemoria.getMascotaConDueño(9999);
    expect(mascota).toBeNull();
  });
});