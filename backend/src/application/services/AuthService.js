const IAuthService = require('../../domain/ports/IAuthService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'secret_key';

class AuthService extends IAuthService {
  constructor(authRepository) {
    super();
    this.authRepository = authRepository;
  }

  async registro(datos) {
    const { nombre_completo, email, contraseña } = datos;
    if (!nombre_completo || !email || !contraseña) {
      throw new Error('Datos incompletos');
    }
    const hash = await bcrypt.hash(contraseña, 10);
    return await this.authRepository.create({ nombre_completo, email, contraseña: hash });
  }

  async login(email, contraseña) {
    const usuario = await this.authRepository.findByEmail(email);
    if (!usuario) throw new Error('Credenciales inválidas');
    const valido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!valido) throw new Error('Credenciales inválidas');
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, SECRET, { expiresIn: '24h' });
    return { token, usuario: { id: usuario.id, nombre_completo: usuario.nombre_completo, email: usuario.email, rol: usuario.rol } };
  }
}

module.exports = AuthService;