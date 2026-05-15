const MascotaService = require('../../src/application/services/MascotaService');

const mockMascotaRepository = {
  getMascotasConDueños: jest.fn(),
  getMascotaConDueño: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

const mockDueñoRepository = {
  create: jest.fn()
};

const mockProductoRepository = {
  getById: jest.fn(),
  update: jest.fn()
};

describe('MascotaService', () => {
  let mascotaService;

  beforeEach(() => {
    jest.clearAllMocks();
    mascotaService = new MascotaService(mockMascotaRepository, mockDueñoRepository, mockProductoRepository);
  });

  test('CP15 - obtenerTodas debe retornar lista de mascotas', async () => {
    const mascotasFake = [{ id: 1, nombre: 'Firulais' }];
    mockMascotaRepository.getMascotasConDueños.mockResolvedValue(mascotasFake);
    const resultado = await mascotaService.obtenerTodas();
    expect(resultado).toEqual(mascotasFake);
    expect(mockMascotaRepository.getMascotasConDueños).toHaveBeenCalledTimes(1);
  });

  test('CP16 - obtenerPorId con id inexistente debe lanzar error', async () => {
    mockMascotaRepository.getMascotaConDueño.mockResolvedValue(null);
    await expect(mascotaService.obtenerPorId(99)).rejects.toThrow('Mascota no encontrada');
  });

  test('CP17 - obtenerPorId con id existente debe retornar la mascota', async () => {
    const mascotaFake = { id: 1, nombre: 'Firulais' };
    mockMascotaRepository.getMascotaConDueño.mockResolvedValue(mascotaFake);
    const resultado = await mascotaService.obtenerPorId(1);
    expect(resultado).toEqual(mascotaFake);
  });

  test('CP18 - actualizar mascota debe llamar al repositorio', async () => {
    const datos = { nombre: 'Firulais actualizado' };
    mockMascotaRepository.update.mockResolvedValue({ id: 1, ...datos });
    const resultado = await mascotaService.actualizar(1, datos);
    expect(resultado).toEqual({ id: 1, ...datos });
    expect(mockMascotaRepository.update).toHaveBeenCalledTimes(1);
  });

  test('CP19 - eliminar mascota debe llamar al repositorio', async () => {
    mockMascotaRepository.getById.mockResolvedValue({ id: 1, nombre: 'Firulais', id_dueño: 1 });
    mockMascotaRepository.delete.mockResolvedValue({ success: true });
    await mascotaService.eliminar(1);
    expect(mockMascotaRepository.delete).toHaveBeenCalledTimes(1);
  });

  test('CP20 - crear mascota debe llamar al repositorio de dueños', async () => {
    mockDueñoRepository.create.mockResolvedValue({ id: 1 });
    mockMascotaRepository.create.mockResolvedValue({ id: 1, nombre: 'Firulais' });
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
    expect(mockDueñoRepository.create).toHaveBeenCalledTimes(1);
  });
});