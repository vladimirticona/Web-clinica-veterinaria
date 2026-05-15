const IProductoService = require('../../domain/ports/IProductoService');
const Producto = require('../../domain/entities/Producto');

class ProductoService extends IProductoService {
  constructor(productoRepository) {
    super();
    this.productoRepository = productoRepository;
  }

  async obtenerTodos() {
    return await this.productoRepository.getAll();
  }

  async obtenerPorId(id) {
    const producto = await this.productoRepository.getById(id);
    if (!producto) throw new Error('Producto no encontrado');
    return producto;
  }

  async crear(datos) {
    const producto = new Producto(datos);
    producto.validar();
    return await this.productoRepository.create(datos);
  }

  async actualizar(id, datos) {
    const productoExistente = await this.productoRepository.getById(id);
    if (!productoExistente) throw new Error('Producto no encontrado');

    const producto = new Producto(productoExistente);

    // Aplicar cambios usando métodos del dominio
    if (datos.nombre) producto.cambiarNombre(datos.nombre);
    if (datos.precio !== undefined) producto.cambiarPrecio(datos.precio);
    if (datos.cantidad !== undefined) producto.aumentarStock(datos.cantidad - producto.cantidad); // ajustar stock

    producto.validar();

    return await this.productoRepository.update(id, {
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: producto.cantidad
    });
  }

  async eliminar(id) {
    return await this.productoRepository.delete(id);
  }
}

module.exports = ProductoService;