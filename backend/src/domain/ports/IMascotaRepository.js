class IMascotaRepository {
  async getMascotasConDueños() { throw new Error('No implementado'); }
  async getMascotaConDueño(id) { throw new Error('No implementado'); }
  async getById(id) { throw new Error('No implementado'); }
  async create(datos) { throw new Error('No implementado'); }
  async update(id, datos) { throw new Error('No implementado'); }
  async delete(id) { throw new Error('No implementado'); }
}

module.exports = IMascotaRepository;