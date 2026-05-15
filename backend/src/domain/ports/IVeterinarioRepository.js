class IVeterinarioRepository {
  async crear(veterinario) {
    throw new Error('Método crear no implementado');
  }

  async obtenerPorId(id) {
    throw new Error('Método obtenerPorId no implementado');
  }

  async obtenerPorEspecialidad(especialidad) {
    throw new Error('Método obtenerPorEspecialidad no implementado');
  }

  async obtenerTodos() {
    throw new Error('Método obtenerTodos no implementado');
  }

  async actualizar(id, veterinario) {
    throw new Error('Método actualizar no implementado');
  }

  async eliminar(id) {
    throw new Error('Método eliminar no implementado');
  }
}

module.exports = IVeterinarioRepository;