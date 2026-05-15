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
    const reservacionExistente = await this.reservacionRepository.getById(id);
    if (!reservacionExistente) throw new Error('Reservacion no encontrada');

    const reservacion = new Reservacion(reservacionExistente);
    reservacion.validarEstado(estado);

    if (estado === 'confirmada') {
      reservacion.confirmar();
    } else if (estado === 'cancelada') {
      reservacion.cancelar();
    }

    return await this.reservacionRepository.update(id, { estado: reservacion.estado });
  }

  async actualizar(id, datos) {
    const reservacionExistente = await this.reservacionRepository.getById(id);
    if (!reservacionExistente) throw new Error('Reservacion no encontrada');

    const reservacion = new Reservacion(reservacionExistente);

    // Aplicar cambios usando métodos del dominio
    if (datos.motivo_consulta) reservacion.cambiarMotivo(datos.motivo_consulta);
    if (datos.fecha_solicitada && datos.hora_solicitada) {
      reservacion.reprogramar(datos.fecha_solicitada, datos.hora_solicitada);
    }
    if (datos.producto_adicional_id !== undefined) {
      reservacion.asignarProducto(datos.producto_adicional_id, datos.cantidad_producto || 0);
    }

    reservacion.validar();

    return await this.reservacionRepository.update(id, {
      nombre_cliente: reservacion.nombre_cliente,
      telefono: reservacion.telefono,
      email: reservacion.email,
      nombre_mascota: reservacion.nombre_mascota,
      especie: reservacion.especie,
      motivo_consulta: reservacion.motivo_consulta,
      fecha_solicitada: reservacion.fecha_solicitada,
      hora_solicitada: reservacion.hora_solicitada,
      tipo_cita: reservacion.tipo_cita,
      estado: reservacion.estado,
      producto_adicional_id: reservacion.producto_adicional_id,
      cantidad_producto: reservacion.cantidad_producto
    });
  }

  async eliminar(id) {
    const reservacion = await this.reservacionRepository.getById(id);
    if (!reservacion) throw new Error('Reservacion no encontrada');
    await this.reservacionRepository.delete(id);
  }
}

module.exports = ReservacionService;