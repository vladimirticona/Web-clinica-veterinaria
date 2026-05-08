class ProductoController {
  constructor(productoService) {
    this.productoService = productoService;
    this.obtenerTodos = this.obtenerTodos.bind(this);
    this.crear = this.crear.bind(this);
    this.actualizar = this.actualizar.bind(this);
    this.eliminar = this.eliminar.bind(this);
  }

  async obtenerTodos(req, res) {
    try {
      const productos = await this.productoService.obtenerTodos();
      res.status(200).json(productos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos', mensaje: error.message });
    }
  }

  async crear(req, res) {
    try {
      const resultado = await this.productoService.crear(req.body);
      res.status(201).json({ mensaje: 'Producto creado exitosamente', producto: resultado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async actualizar(req, res) {
    try {
      const resultado = await this.productoService.actualizar(req.params.id, req.body);
      res.status(200).json(resultado);
    } catch (error) {
      const status = error.message === 'Producto no encontrado' ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      await this.productoService.eliminar(req.params.id);
      res.status(204).send();
    } catch (error) {
      const status = error.message === 'Producto no encontrado' ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  }
}

module.exports = ProductoController;