const IProductoRepository = require('../../domain/ports/IProductoRepository');

class InMemoryProductoRepository extends IProductoRepository {
  constructor() {
    super();
    this.productos = [];
    this.nextId = 1;
  }

  async getAll() {
    return this.productos;
  }

  getById(id) {
    return this.productos.find(p => p.id === Number(id)) || null;
  }

  create(datos) {
    const producto = {
      id: this.nextId++,
      ...datos
    };
    this.productos.push(producto);
    return producto;
  }

  update(id, datos) {
    const index = this.productos.findIndex(p => p.id === Number(id));
    if (index === -1) {
      throw new Error('Registro no encontrado');
    }
    this.productos[index] = { ...this.productos[index], ...datos, id: Number(id) };
    return this.productos[index];
  }

  async delete(id) {
    const index = this.productos.findIndex(p => p.id === Number(id));
    if (index === -1) {
      throw new Error('Registro no encontrado');
    }
    const [deleted] = this.productos.splice(index, 1);
    return { success: true, deleted };
  }
}

module.exports = InMemoryProductoRepository;
