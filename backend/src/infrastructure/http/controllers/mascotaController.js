class MascotaController {
  constructor(mascotaService) {
    this.mascotaService = mascotaService;
    this.obtenerTodas = this.obtenerTodas.bind(this);
    this.obtenerPorId = this.obtenerPorId.bind(this);
    this.crear = this.crear.bind(this);
    this.actualizar = this.actualizar.bind(this);
    this.eliminar = this.eliminar.bind(this);
  }

  async obtenerTodas(req, res) {
    try {
      const mascotas = await this.mascotaService.obtenerTodas();
      res.status(200).json(mascotas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener mascotas', mensaje: error.message });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const mascota = await this.mascotaService.obtenerPorId(req.params.id);
      res.status(200).json(mascota);
    } catch (error) {
      const status = error.message === 'Mascota no encontrada' ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  }

  async crear(req, res) {
    try {
      const resultado = await this.mascotaService.crear(req.body);
      res.status(201).json({ mensaje: 'Mascota y dueño registrados exitosamente', ...resultado });
    } catch (error) {
      const status = error.message.includes('requeridos') ? 400 : 500;
      res.status(status).json({ error: error.message });
    }
  }

  async actualizar(req, res) {
    try {
      const resultado = await this.mascotaService.actualizar(req.params.id, req.body);
      res.status(200).json(resultado);
    } catch (error) {
      const status = error.message === 'Mascota no encontrada' ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      await this.mascotaService.eliminar(req.params.id);
      res.status(204).send();
    } catch (error) {
      const status = error.message === 'Mascota no encontrada' ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  }
}

module.exports = MascotaController;