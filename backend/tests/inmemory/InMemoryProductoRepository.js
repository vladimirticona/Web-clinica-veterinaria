class InMemoryProductoRepository {
  constructor() {
    this.data = [];
  }

  async create(producto) {
    const nuevo = { ...producto, id: this.data.length + 1 };
    this.data.push(nuevo);
    return nuevo;
  }

  async getById(id) {
    return this.data.find((item) => item.id === id) || null;
  }

  async update(id, cambios) {
    const index = this.data.findIndex((item) => item.id === id);
    if (index < 0) return null;
    this.data[index] = { ...this.data[index], ...cambios };
    return this.data[index];
  }

  async clear() {
    this.data = [];
  }
}

module.exports = InMemoryProductoRepository;
