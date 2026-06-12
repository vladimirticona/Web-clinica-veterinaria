const IReservacionService = require('../../domain/ports/IReservacionService');
const Reservacion = require('../../domain/entities/Reservacion');

class ReservacionService extends IReservacionService {
  constructor(reservacionRepository, productoRepository) {
    super();
    this.reservacionRepository = reservacionRepository;
    this.productoRepository = productoRepository;
  }

  async obtenerTodas() {
    return await this.reservacionRepository.getAllConProductos();
  }

  async crear(datos) {
    const reservacion = new Reservacion(datos);
    reservacion.validar();

    const nuevaReservacion = await this.reservacionRepository.create(reservacion);

    if (datos.producto_adicional_id && datos.cantidad_producto) {
      const producto = await this.productoRepository.getById(datos.producto_adicional_id);
      if (producto) {
        const nuevaCantidad = producto.cantidad - datos.cantidad_producto;
        if (nuevaCantidad >= 0) {
          await this.productoRepository.update(datos.producto_adicional_id, { cantidad: nuevaCantidad });
        }
      }
    }

    return nuevaReservacion;
  }

  async actualizarEstado(id, estado) {
    const reservacion = new Reservacion({});
    reservacion.validarEstado(estado);
    return await this.reservacionRepository.update(id, { estado });
  }

  async eliminar(id) {
    const reservacion = await this.reservacionRepository.getById(id);
    if (!reservacion) throw new Error('Reservacion no encontrada');
    await this.reservacionRepository.delete(id);
  }
}

module.exports = ReservacionService;