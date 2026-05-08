const IMascotaService = require('../../domain/ports/IMascotaService');
const Mascota = require('../../domain/entities/Mascota');

class MascotaService extends IMascotaService {
  constructor(mascotaRepository, dueñoRepository, productoRepository) {
    super();
    this.mascotaRepository = mascotaRepository;
    this.dueñoRepository = dueñoRepository;
    this.productoRepository = productoRepository;
  }

  async obtenerTodas() {
    return await this.mascotaRepository.getMascotasConDueños();
  }

  async obtenerPorId(id) {
    const mascota = await this.mascotaRepository.getMascotaConDueño(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    return mascota;
  }

  async crear(datos) {
    const mascota = new Mascota(datos);
    mascota.validar();

    const nuevoDueño = await this.dueñoRepository.create({
      nombre_completo: datos.nombre_dueño,
      telefono: datos.telefono,
      email: datos.email
    });

    mascota.id_dueño = nuevoDueño.id;
    const nuevaMascota = await this.mascotaRepository.create(mascota);

    if (datos.producto_adicional_id && datos.cantidad_producto) {
      const producto = await this.productoRepository.getById(datos.producto_adicional_id);
      if (producto) {
        const nuevaCantidad = producto.cantidad - datos.cantidad_producto;
        if (nuevaCantidad >= 0) {
          await this.productoRepository.update(datos.producto_adicional_id, { cantidad: nuevaCantidad });
        }
      }
    }

    return { mascota: nuevaMascota, dueño: nuevoDueño };
  }

  async actualizar(id, datos) {
    return await this.mascotaRepository.update(id, datos);
  }

  async eliminar(id) {
    const mascota = await this.mascotaRepository.getById(id);
    if (!mascota) throw new Error('Mascota no encontrada');
    await this.mascotaRepository.delete(id);
    return mascota.id_dueño;
  }
}

module.exports = MascotaService;