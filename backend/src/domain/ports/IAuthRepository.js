class IAuthRepository {
  async findByEmail(email) {
    throw new Error('Method not implemented');
  }

  async create(datos) {
    throw new Error('Method not implemented');
  }
}

module.exports = IAuthRepository;