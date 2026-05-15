class IVeterinarioService {
  async crearVeterinario(veterinario) {
    throw new Error('Método crearVeterinario no implementado');
  }

  async obtenerVeterinarioPorId(id) {
    throw new Error('Método obtenerVeterinarioPorId no implementado');
  }

  async obtenerVeterinariosPorEspecialidad(especialidad) {
    throw new Error('Método obtenerVeterinariosPorEspecialidad no implementado');
  }

  async obtenerTodosLosVeterinarios() {
    throw new Error('Método obtenerTodosLosVeterinarios no implementado');
  }

  async actualizarVeterinario(id, veterinario) {
    throw new Error('Método actualizarVeterinario no implementado');
  }

  async eliminarVeterinario(id) {
    throw new Error('Método eliminarVeterinario no implementado');
  }
}

module.exports = IVeterinarioService;