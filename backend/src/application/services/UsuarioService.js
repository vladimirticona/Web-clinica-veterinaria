const IUsuarioService = require('../../domain/ports/IUsuarioService');
const Usuario = require('../../domain/entities/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../utils/constants');

class UsuarioService extends IUsuarioService {
  constructor(usuarioRepository) {
    super();
    this.usuarioRepository = usuarioRepository;
  }

  async crearUsuario(usuarioData) {
    const usuario = new Usuario(null, usuarioData.nombre, usuarioData.email, usuarioData.password, usuarioData.rol);
    usuario.validar();

    // Hash password
    const saltRounds = 10;
    usuario.password = await bcrypt.hash(usuario.password, saltRounds);

    return await this.usuarioRepository.crear(usuario);
  }

  async obtenerUsuarioPorId(id) {
    return await this.usuarioRepository.obtenerPorId(id);
  }

  async obtenerUsuarioPorEmail(email) {
    return await this.usuarioRepository.obtenerPorEmail(email);
  }

  async obtenerTodosLosUsuarios() {
    return await this.usuarioRepository.obtenerTodos();
  }

  async actualizarUsuario(id, usuarioData) {
    const usuario = new Usuario(id, usuarioData.nombre, usuarioData.email, usuarioData.password, usuarioData.rol);
    usuario.validar();
    return await this.usuarioRepository.actualizar(id, usuario);
  }

  async eliminarUsuario(id) {
    return await this.usuarioRepository.eliminar(id);
  }

  async login(email, password) {
    const usuario = await this.usuarioRepository.obtenerPorEmail(email);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const isValidPassword = await bcrypt.compare(password, usuario.password);
    if (!isValidPassword) {
      throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, JWT_SECRET, { expiresIn: '1h' });
    return { token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } };
  }
}

module.exports = UsuarioService;