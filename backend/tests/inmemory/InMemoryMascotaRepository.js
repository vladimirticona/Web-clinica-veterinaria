class InMemoryMascotaRepository {
  constructor() {
    this.data = [];
  }

  async create(mascota) {
    const copy = { ...mascota };
    copy.id = this.data.length + 1;
    this.data.push(copy);
    return copy;
  }

  async getById(id) {
    return this.data.find(d => d.id === id) || null;
  }

  async getMascotasConDueños() {
    return this.data;
  }

  async getMascotaConDueño(id) {
    return this.getById(id);
  }

  async update(id, changes) {
    const i = this.data.findIndex(d => d.id === id);
    if (i < 0) return null;
    this.data[i] = { ...this.data[i], ...changes };
    return this.data[i];
  }

  async delete(id) {
    const i = this.data.findIndex(d => d.id === id);
    if (i < 0) return false;
    this.data.splice(i, 1);
    return true;
  }

  clear() {
    this.data = [];
  }
}

module.exports = InMemoryMascotaRepository;
