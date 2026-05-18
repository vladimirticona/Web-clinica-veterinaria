const IMascotaRepository = require('../../domain/ports/IMascotaRepository');

class InMemoryMascotaRepository extends IMascotaRepository {
  constructor(duenoRepository, productoRepository) {
    super();
    this.mascotas = [];
    this.nextId = 1;
    this.duenoRepository = duenoRepository;
    this.productoRepository = productoRepository;
  }

  _attachRelations(mascota) {
    const dueno = mascota.id_dueño ? this.duenoRepository.getById(mascota.id_dueño) : null;
    const producto = mascota.producto_adicional_id ? this.productoRepository.getById(mascota.producto_adicional_id) : null;
    return {
      ...mascota,
      nombre_dueño: dueno ? dueno.nombre_completo : undefined,
      telefono: dueno ? dueno.telefono : undefined,
      email_dueño: dueno ? dueno.email : undefined,
      nombre_producto: producto ? producto.nombre : undefined,
      precio_producto: producto ? producto.precio : undefined
    };
  }

  async getMascotasConDueños() {
    return this.mascotas.map(m => this._attachRelations(m));
  }

  async getMascotaConDueño(id) {
    const mascota = this.mascotas.find(m => m.id === Number(id));
    return mascota ? this._attachRelations(mascota) : null;
  }

  async getById(id) {
    return this.mascotas.find(m => m.id === Number(id)) || null;
  }

  async create(datos) {
    const mascota = {
      id: this.nextId++,
      ...datos
    };
    this.mascotas.push(mascota);
    return mascota;
  }

  async update(id, datos) {
    const index = this.mascotas.findIndex(m => m.id === Number(id));
    if (index === -1) {
      throw new Error('Registro no encontrado');
    }
    this.mascotas[index] = { ...this.mascotas[index], ...datos, id: Number(id) };
    return this.mascotas[index];
  }

  async delete(id) {
    const index = this.mascotas.findIndex(m => m.id === Number(id));
    if (index === -1) {
      throw new Error('Registro no encontrado');
    }
    const [deleted] = this.mascotas.splice(index, 1);
    return { success: true, deleted };
  }
}

module.exports = InMemoryMascotaRepository;
