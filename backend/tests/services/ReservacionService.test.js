const ReservacionService = require('../../src/application/services/ReservacionService');

const mockReservacionRepository = {
  getAllConProductos: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

const mockProductoRepository = {
  getById: jest.fn(),
  update: jest.fn()
};

describe('ReservacionService', () => {
  let reservacionService;

  beforeEach(() => {
    jest.clearAllMocks();
    reservacionService = new ReservacionService(mockReservacionRepository, mockProductoRepository);
  });

  test('CP21 - crear reservacion debe llamar al repositorio', async () => {
    const datos = {
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
    const reservacionFake = { id: 1, ...datos };
    mockReservacionRepository.create.mockResolvedValue(reservacionFake);
    const resultado = await reservacionService.crear(datos);
    expect(resultado).toEqual(reservacionFake);
    expect(mockReservacionRepository.create).toHaveBeenCalledTimes(1);
  });

  test('CP22 - actualizarEstado con estado invalido debe lanzar error', async () => {
    await expect(reservacionService.actualizarEstado(1, 'invalido')).rejects.toThrow('Estado invalido');
  });

  test('CP23 - obtenerTodas debe retornar lista de reservaciones', async () => {
    const reservacionesFake = [{ id: 1, nombre_cliente: 'Juan Perez' }];
    mockReservacionRepository.getAllConProductos.mockResolvedValue(reservacionesFake);
    const resultado = await reservacionService.obtenerTodas();
    expect(resultado).toEqual(reservacionesFake);
    expect(mockReservacionRepository.getAllConProductos).toHaveBeenCalledTimes(1);
  });

  test('CP24 - eliminar reservacion debe llamar al repositorio', async () => {
    mockReservacionRepository.getById.mockResolvedValue({ id: 1, nombre_cliente: 'Juan Perez' });
    mockReservacionRepository.delete.mockResolvedValue({ success: true });
    await reservacionService.eliminar(1);
    expect(mockReservacionRepository.delete).toHaveBeenCalledTimes(1);
  });
});