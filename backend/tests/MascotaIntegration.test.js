const MascotaService = require('../src/application/services/MascotaService');
const InMemoryMascotaRepository = require('./inmemory/InMemoryMascotaRepository');
const InMemoryDueñoRepository = require('./inmemory/InMemoryDueñoRepository');
const InMemoryProductoRepository = require('./inmemory/InMemoryProductoRepository');

describe('Mascota Integration - Repositorios en memoria', () => {
  let mascotaRepo;
  let dueñoRepo;
  let productoRepo;
  let mascotaService;

  beforeEach(() => {
    mascotaRepo = new InMemoryMascotaRepository();
    dueñoRepo = new InMemoryDueñoRepository();
    productoRepo = new InMemoryProductoRepository();
    mascotaService = new MascotaService(mascotaRepo, dueñoRepo, productoRepo);
  });

  test('debe crear mascota, dueño y reducir stock de producto', async () => {
    const producto = await productoRepo.create({ nombre: 'Vacuna', precio: 50, cantidad: 10 });

    const datos = {
      nombre: 'Firulais',
      especie: 'Perro',
      edad: 3,
      sexo: 'Macho',
      motivo: 'Vacunación',
      nombre_dueño: 'Juan Pérez',
      telefono: '123456789',
      email: 'juan@example.com',
      producto_adicional_id: producto.id,
      cantidad_producto: 2
    };

    const resultado = await mascotaService.crear(datos);

    expect(resultado.dueño.id).toBe(1);
    expect(resultado.mascota.id_dueño).toBe(1);

    const productoActualizado = await productoRepo.getById(producto.id);
    expect(productoActualizado.cantidad).toBe(8);
  });

  test('debe devolver lista de mascotas con dueños', async () => {
    await dueñoRepo.create({ nombre_completo: 'Juan Pérez', telefono: '123456789', email: 'juan@example.com' });
    await mascotaRepo.create({ id_dueño: 1, nombre: 'Firulais', especie: 'perro', edad: 3, sexo: 'Macho' });

    const mascotas = await mascotaService.obtenerTodas();
    expect(mascotas).toHaveLength(1);
    expect(mascotas[0].nombre).toBe('Firulais');
  });

  test('debe lanzar error si se crea mascota con datos inválidos', async () => {
    const datos = {
      nombre: '',
      especie: 'Perro',
      edad: 3,
      sexo: 'Macho',
      nombre_dueño: 'Juan Pérez',
      telefono: '123456789',
      email: 'juan@example.com'
    };

    await expect(mascotaService.crear(datos)).rejects.toThrow('Faltan campos requeridos: nombre, especie, edad, sexo');
  });
});
