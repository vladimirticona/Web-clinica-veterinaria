class IAuthService {
  async login(email, contraseña) {
    throw new Error('Method not implemented');
  }

  async registro(datos) {
    throw new Error('Method not implemented');
  }
}

module.exports = IAuthService;