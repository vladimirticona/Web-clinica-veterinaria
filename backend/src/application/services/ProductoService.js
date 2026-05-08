const IProductoService = require('../../domain/ports/IProductoService');

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
    return await this.productoRepository.create(datos);
  }

  async actualizar(id, datos) {
    return await this.productoRepository.update(id, datos);
  }

  async eliminar(id) {
    return await this.productoRepository.delete(id);
  }
}

module.exports = ProductoService;