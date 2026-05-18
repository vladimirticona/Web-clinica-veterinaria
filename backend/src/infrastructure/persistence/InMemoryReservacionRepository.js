const IReservacionRepository = require('../../domain/ports/IReservacionRepository');

class InMemoryReservacionRepository extends IReservacionRepository {
  constructor(productoRepository) {
    super();
    this.reservaciones = [];
    this.nextId = 1;
    this.productoRepository = productoRepository;
  }

  _attachProducto(reservacion) {
    const producto = reservacion.producto_adicional_id
      ? this.productoRepository.getById(reservacion.producto_adicional_id)
      : null;
    return {
      ...reservacion,
      nombre_producto: producto ? producto.nombre : undefined,
      precio_producto: producto ? producto.precio : undefined
    };
  }

  async getAllConProductos() {
    return this.reservaciones.map(r => this._attachProducto(r));
  }

  async getById(id) {
    return this.reservaciones.find(r => r.id === Number(id)) || null;
  }

  async create(datos) {
    const reservacion = {
      id: this.nextId++,
      ...datos
    };
    this.reservaciones.push(reservacion);
    return reservacion;
  }

  async update(id, datos) {
    const index = this.reservaciones.findIndex(r => r.id === Number(id));
    if (index === -1) {
      throw new Error('Registro no encontrado');
    }
    this.reservaciones[index] = { ...this.reservaciones[index], ...datos, id: Number(id) };
    return this.reservaciones[index];
  }

  async delete(id) {
    const index = this.reservaciones.findIndex(r => r.id === Number(id));
    if (index === -1) {
      throw new Error('Registro no encontrado');
    }
    const [deleted] = this.reservaciones.splice(index, 1);
    return { success: true, deleted };
  }
}

module.exports = InMemoryReservacionRepository;
