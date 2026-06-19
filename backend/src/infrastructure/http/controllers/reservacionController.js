class ReservacionController {
  constructor(reservacionService) {
    this.reservacionService = reservacionService;
    this.obtenerTodas = this.obtenerTodas.bind(this);
    this.crear = this.crear.bind(this);
    this.actualizarEstado = this.actualizarEstado.bind(this);
    this.eliminar = this.eliminar.bind(this);
  }

  async obtenerTodas(req, res) {
    try {
      const reservaciones = await this.reservacionService.obtenerTodas();
      res.status(200).json(reservaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener reservaciones', mensaje: error.message });
    }
  }

  async crear(req, res) {
    try {
      const resultado = await this.reservacionService.crear(req.body);
      res.status(201).json({ mensaje: 'Reservacion creada exitosamente', reservacion: resultado });
    } catch (error) {
      const status = error.message.includes('requeridos') ? 400 : 500;
      res.status(status).json({ error: error.message });
    }
  }

  async actualizarEstado(req, res) {
    try {
      const resultado = await this.reservacionService.actualizarEstado(req.params.id, req.body.estado);
      res.status(200).json({ mensaje: 'Estado actualizado exitosamente', reservacion: resultado });
    } catch (error) {
      const status = error.message.includes('invalido') ? 400 : 500;
      res.status(status).json({ error: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      await this.reservacionService.eliminar(req.params.id);
      res.status(204).send();
    } catch (error) {
      const status = error.message === 'Reservacion no encontrada' ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  }
}

module.exports = ReservacionController;