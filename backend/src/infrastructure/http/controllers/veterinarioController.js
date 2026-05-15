class VeterinarioController {
  constructor(veterinarioService) {
    this.veterinarioService = veterinarioService;
    this.obtenerTodos = this.obtenerTodos.bind(this);
    this.obtenerPorId = this.obtenerPorId.bind(this);
    this.crear = this.crear.bind(this);
    this.actualizar = this.actualizar.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.obtenerPorEspecialidad = this.obtenerPorEspecialidad.bind(this);
  }

  async obtenerTodos(req, res) {
    try {
      const veterinarios = await this.veterinarioService.obtenerTodosLosVeterinarios();
      res.status(200).json(veterinarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const veterinario = await this.veterinarioService.obtenerVeterinarioPorId(id);
      if (!veterinario) {
        return res.status(404).json({ error: 'Veterinario no encontrado' });
      }
      res.status(200).json(veterinario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerPorEspecialidad(req, res) {
    try {
      const { especialidad } = req.params;
      const veterinarios = await this.veterinarioService.obtenerVeterinariosPorEspecialidad(especialidad);
      res.status(200).json(veterinarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async crear(req, res) {
    try {
      const veterinario = await this.veterinarioService.crearVeterinario(req.body);
      res.status(201).json(veterinario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const veterinario = await this.veterinarioService.actualizarVeterinario(id, req.body);
      res.status(200).json(veterinario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await this.veterinarioService.eliminarVeterinario(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = VeterinarioController;