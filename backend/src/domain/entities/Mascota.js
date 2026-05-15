class Mascota {
  constructor({ id, nombre, especie, edad, sexo, motivo, id_dueño, producto_adicional_id, cantidad_producto }) {
    this.id = id;
    this.nombre = nombre;
    this.especie = especie ? especie.toLowerCase() : null;
    this.edad = edad;
    this.sexo = sexo;
    this.motivo = motivo;
    this.id_dueño = id_dueño;
    this.producto_adicional_id = producto_adicional_id;
    this.cantidad_producto = cantidad_producto;
  }

  validar() {
    if (!this.nombre || !this.especie || !this.edad || !this.sexo) {
      throw new Error('Faltan campos requeridos: nombre, especie, edad, sexo');
    }
    if (this.edad < 0) {
      throw new Error('La edad no puede ser negativa');
    }
  }

  cambiarNombre(nuevoNombre) {
    if (!nuevoNombre || nuevoNombre.trim() === '') {
      throw new Error('El nombre no puede estar vacío');
    }
    this.nombre = nuevoNombre.trim();
  }

  cambiarMotivo(nuevoMotivo) {
    this.motivo = nuevoMotivo;
  }

  asignarProducto(productoId, cantidad) {
    this.producto_adicional_id = productoId;
    this.cantidad_producto = cantidad;
  }

  esAdulto() {
    // Asumiendo que perro/gato adulto > 1 año
    return this.edad > 1;
  }

  obtenerInformacionBasica() {
    return {
      id: this.id,
      nombre: this.nombre,
      especie: this.especie,
      edad: this.edad,
      sexo: this.sexo
    };
  }
}

module.exports = Mascota;