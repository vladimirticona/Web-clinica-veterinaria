class Reservacion {
  constructor({ id, nombre_cliente, telefono, email, nombre_mascota, especie, motivo_consulta, fecha_solicitada, hora_solicitada, tipo_cita, estado, producto_adicional_id, cantidad_producto }) {
    this.id = id;
    this.nombre_cliente = nombre_cliente;
    this.telefono = telefono;
    this.email = email;
    this.nombre_mascota = nombre_mascota;
    this.especie = especie ? especie.toLowerCase() : null;
    this.motivo_consulta = motivo_consulta;
    this.fecha_solicitada = fecha_solicitada;
    this.hora_solicitada = hora_solicitada;
    this.tipo_cita = tipo_cita;
    this.estado = estado || 'pendiente';
    this.producto_adicional_id = producto_adicional_id;
    this.cantidad_producto = cantidad_producto;
  }

  validar() {
    if (!this.nombre_cliente || !this.telefono || !this.email || !this.nombre_mascota ||
        !this.especie || !this.motivo_consulta || !this.fecha_solicitada ||
        !this.hora_solicitada || !this.tipo_cita) {
      throw new Error('Faltan campos requeridos para la reservacion');
    }
  }

  validarEstado(estado) {
    const estadosValidos = ['pendiente', 'confirmada', 'cancelada', 'reprogramar'];
    if (!estadosValidos.includes(estado)) {
      throw new Error('Estado invalido. Debe ser: pendiente, confirmada, cancelada o reprogramar');
    }
  }

  confirmar() {
    this.estado = 'confirmada';
  }

  cancelar() {
    this.estado = 'cancelada';
  }

  reprogramar(nuevaFecha, nuevaHora) {
    if (!nuevaFecha || !nuevaHora) {
      throw new Error('Fecha y hora nuevas son requeridas para reprogramar');
    }
    this.fecha_solicitada = nuevaFecha;
    this.hora_solicitada = nuevaHora;
    this.estado = 'reprogramar';
  }

  cambiarMotivo(nuevoMotivo) {
    this.motivo_consulta = nuevoMotivo;
  }

  asignarProducto(productoId, cantidad) {
    this.producto_adicional_id = productoId;
    this.cantidad_producto = cantidad;
  }

  esPendiente() {
    return this.estado === 'pendiente';
  }

  esConfirmada() {
    return this.estado === 'confirmada';
  }

  obtenerResumen() {
    return {
      id: this.id,
      cliente: this.nombre_cliente,
      mascota: this.nombre_mascota,
      fecha: this.fecha_solicitada,
      hora: this.hora_solicitada,
      estado: this.estado,
      tipo: this.tipo_cita
    };
  }
}

module.exports = Reservacion;