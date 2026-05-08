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
  }

  reducirStock(cantidad) {
    if (this.cantidad - cantidad < 0) {
      throw new Error('Stock insuficiente');
    }
    this.cantidad = this.cantidad - cantidad;
  }
}

module.exports = Producto;