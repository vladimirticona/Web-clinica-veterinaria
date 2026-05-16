class InMemoryDueñoRepository {
  constructor() {
    this.data = [];
  }

  async create(dueño) {
    const nuevo = { ...dueño, id: this.data.length + 1 };
    this.data.push(nuevo);
    return nuevo;
  }

  async getById(id) {
    return this.data.find((item) => item.id === id) || null;
  }

  async clear() {
    this.data = [];
  }
}

module.exports = InMemoryDueñoRepository;
