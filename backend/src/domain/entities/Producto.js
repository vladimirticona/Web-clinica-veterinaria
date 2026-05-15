class Producto {
  constructor({ id, nombre, precio, cantidad }) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.cantidad = cantidad;
  }

  validar() {
    if (!this.nombre || !this.precio) {
      throw new Error('Faltan campos requeridos: nombre, precio');
    }
    if (this.precio < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    if (this.cantidad < 0) {
      throw new Error('La cantidad no puede ser negativa');
    }
  }

  reducirStock(cantidad) {
    if (this.cantidad - cantidad < 0) {
      throw new Error('Stock insuficiente');
    }
    this.cantidad = this.cantidad - cantidad;
  }

  aumentarStock(cantidad) {
    if (cantidad <= 0) {
      throw new Error('La cantidad a aumentar debe ser positiva');
    }
    this.cantidad += cantidad;
  }

  cambiarPrecio(nuevoPrecio) {
    if (nuevoPrecio < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    this.precio = nuevoPrecio;
  }

  cambiarNombre(nuevoNombre) {
    if (!nuevoNombre || nuevoNombre.trim() === '') {
      throw new Error('El nombre no puede estar vacío');
    }
    this.nombre = nuevoNombre.trim();
  }

  tieneStock() {
    return this.cantidad > 0;
  }

  calcularValorTotal() {
    return this.precio * this.cantidad;
  }
}

module.exports = Producto;