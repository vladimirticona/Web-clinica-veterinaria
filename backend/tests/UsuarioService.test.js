const UsuarioService = require('../src/application/services/UsuarioService');
const Usuario = require('../src/domain/entities/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock del repositorio
const mockUsuarioRepository = {
  crear: jest.fn(),
  obtenerPorId: jest.fn(),
  obtenerPorEmail: jest.fn(),
  obtenerTodos: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn()
};

// Mock de bcrypt y jwt
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UsuarioService', () => {
  let usuarioService;

  beforeEach(() => {
    usuarioService = new UsuarioService(mockUsuarioRepository);
    jest.clearAllMocks();
  });

  describe('crearUsuario', () => {
    test('debe crear un usuario correctamente', async () => {
      const usuarioData = { nombre: 'Juan Pérez', email: 'juan@example.com', password: 'password123', rol: 'usuario' };
      const hashedPassword = 'hashedPassword';
      const createdUsuario = new Usuario(1, usuarioData.nombre, usuarioData.email, hashedPassword, usuarioData.rol);

      bcrypt.hash.mockResolvedValue(hashedPassword);
      mockUsuarioRepository.crear.mockResolvedValue(createdUsuario);

      const result = await usuarioService.crearUsuario(usuarioData);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUsuarioRepository.crear).toHaveBeenCalledWith(expect.any(Usuario));
      expect(result).toEqual(createdUsuario);
    });

    test('debe lanzar error si validación falla', async () => {
      const usuarioData = { nombre: '', email: 'juan@example.com', password: 'password123' };

      await expect(usuarioService.crearUsuario(usuarioData)).rejects.toThrow('Nombre, email y password son requeridos');
    });
  });

  describe('login', () => {
    test('debe retornar token si credenciales son correctas', async () => {
      const email = 'juan@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword';
      const usuario = new Usuario(1, 'Juan Pérez', email, hashedPassword, 'usuario');
      const token = 'jwtToken';

      mockUsuarioRepository.obtenerPorEmail.mockResolvedValue(usuario);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(token);

      const result = await usuarioService.login(email, password);

      expect(mockUsuarioRepository.obtenerPorEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1, email, rol: 'usuario' }, expect.any(String), { expiresIn: '1h' });
      expect(result).toEqual({ token, usuario: { id: 1, nombre: 'Juan Pérez', email, rol: 'usuario' } });
    });

    test('debe lanzar error si usuario no existe', async () => {
      mockUsuarioRepository.obtenerPorEmail.mockResolvedValue(null);

      await expect(usuarioService.login('nonexistent@example.com', 'password')).rejects.toThrow('Usuario no encontrado');
    });

    test('debe lanzar error si contraseña es incorrecta', async () => {
      const usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com', 'hashedPassword', 'usuario');
      mockUsuarioRepository.obtenerPorEmail.mockResolvedValue(usuario);
      bcrypt.compare.mockResolvedValue(false);

      await expect(usuarioService.login('juan@example.com', 'wrongpassword')).rejects.toThrow('Contraseña incorrecta');
    });
  });

  // Agregar más tests para otros métodos si es necesario
});