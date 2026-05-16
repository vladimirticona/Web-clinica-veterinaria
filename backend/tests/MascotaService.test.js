const MascotaService = require('../src/application/services/MascotaService');
const Mascota = require('../src/domain/entities/Mascota');

// Mocks
const mockMascotaRepository = {
  getMascotasConDueños: jest.fn(),
  getMascotaConDueño: jest.fn(),
  create: jest.fn(),
  getById: jest.fn(),
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
    mascotaService = new MascotaService(mockMascotaRepository, mockDueñoRepository, mockProductoRepository);
    jest.clearAllMocks();
  });

  describe('obtenerTodas', () => {
    test('debe retornar todas las mascotas con dueños', async () => {
      const mascotas = [{ id: 1, nombre: 'Firulais' }];
      mockMascotaRepository.getMascotasConDueños.mockResolvedValue(mascotas);

      const result = await mascotaService.obtenerTodas();
      expect(mockMascotaRepository.getMascotasConDueños).toHaveBeenCalled();
      expect(result).toEqual(mascotas);
    });
  });

  describe('obtenerPorId', () => {
    test('debe retornar la mascota si existe', async () => {
      const mascota = { id: 1, nombre: 'Firulais' };
      mockMascotaRepository.getMascotaConDueño.mockResolvedValue(mascota);

      const result = await mascotaService.obtenerPorId(1);
      expect(mockMascotaRepository.getMascotaConDueño).toHaveBeenCalledWith(1);
      expect(result).toEqual(mascota);
    });

    test('debe lanzar error si mascota no existe', async () => {
      mockMascotaRepository.getMascotaConDueño.mockResolvedValue(null);

      await expect(mascotaService.obtenerPorId(1)).rejects.toThrow('Mascota no encontrada');
    });
  });

  describe('crear', () => {
    test('debe crear mascota correctamente sin producto', async () => {
      const datos = {
        nombre: 'Firulais',
        especie: 'Perro',
        edad: 3,
        sexo: 'Macho',
        nombre_dueño: 'Juan Pérez',
        telefono: '123456789',
        email: 'juan@example.com'
      };
      const nuevoDueño = { id: 1, nombre_completo: 'Juan Pérez' };
      const nuevaMascota = { id: 1, nombre: 'Firulais' };

      mockDueñoRepository.create.mockResolvedValue(nuevoDueño);
      mockMascotaRepository.create.mockResolvedValue(nuevaMascota);

      const result = await mascotaService.crear(datos);
      expect(mockDueñoRepository.create).toHaveBeenCalledWith({
        nombre_completo: 'Juan Pérez',
        telefono: '123456789',
        email: 'juan@example.com'
      });
      expect(mockMascotaRepository.create).toHaveBeenCalled();
      expect(result).toEqual({ mascota: nuevaMascota, dueño: nuevoDueño });
    });

    test('debe crear mascota con producto y reducir stock', async () => {
      const datos = {
        nombre: 'Firulais',
        especie: 'Perro',
        edad: 3,
        sexo: 'Macho',
        nombre_dueño: 'Juan Pérez',
        telefono: '123456789',
        email: 'juan@example.com',
        producto_adicional_id: 2,
        cantidad_producto: 1
      };
      const nuevoDueño = { id: 1 };
      const nuevaMascota = { id: 1 };
      const producto = { id: 2, cantidad: 10 };

      mockDueñoRepository.create.mockResolvedValue(nuevoDueño);
      mockMascotaRepository.create.mockResolvedValue(nuevaMascota);
      mockProductoRepository.getById.mockResolvedValue(producto);

      const result = await mascotaService.crear(datos);
      expect(mockProductoRepository.update).toHaveBeenCalledWith(2, { cantidad: 9 });
      expect(result).toEqual({ mascota: nuevaMascota, dueño: nuevoDueño });
    });

    test('debe lanzar error si validación falla', async () => {
      const datos = { nombre: '', especie: 'Perro', edad: 3, sexo: 'Macho' };

      await expect(mascotaService.crear(datos)).rejects.toThrow('Faltan campos requeridos: nombre, especie, edad, sexo');
    });
  });

  describe('actualizar', () => {
    test('debe actualizar mascota existente correctamente', async () => {
      const mascotaExistente = {
        id: 1,
        nombre: 'Firulais',
        especie: 'perro',
        edad: 3,
        sexo: 'Macho',
        motivo: 'Vacunación',
        id_dueño: 1
      };
      const datos = { nombre: 'Rex', motivo: 'Consulta' };
      const mascotaActualizada = { ...mascotaExistente, nombre: 'Rex', motivo: 'Consulta' };

      mockMascotaRepository.getById.mockResolvedValue(mascotaExistente);
      mockMascotaRepository.update.mockResolvedValue(mascotaActualizada);

      const result = await mascotaService.actualizar(1, datos);
      expect(mockMascotaRepository.getById).toHaveBeenCalledWith(1);
      expect(mockMascotaRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({ nombre: 'Rex', motivo: 'Consulta' }));
      expect(result).toEqual(mascotaActualizada);
    });

    test('debe lanzar error si mascota no existe al actualizar', async () => {
      mockMascotaRepository.getById.mockResolvedValue(null);
      await expect(mascotaService.actualizar(1, { nombre: 'Rex' })).rejects.toThrow('Mascota no encontrada');
    });
  });

  describe('eliminar', () => {
    test('debe eliminar mascota existente y retornar id_dueño', async () => {
      const mascotaExistente = { id: 1, nombre: 'Firulais', id_dueño: 5 };
      mockMascotaRepository.getById.mockResolvedValue(mascotaExistente);
      mockMascotaRepository.delete.mockResolvedValue(true);

      const result = await mascotaService.eliminar(1);
      expect(mockMascotaRepository.getById).toHaveBeenCalledWith(1);
      expect(mockMascotaRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(5);
    });

    test('debe lanzar error si mascota no existe al eliminar', async () => {
      mockMascotaRepository.getById.mockResolvedValue(null);
      await expect(mascotaService.eliminar(1)).rejects.toThrow('Mascota no encontrada');
    });
  });
});