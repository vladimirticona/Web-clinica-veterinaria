class IUsuarioRepository {
  async crear(usuario) {
    throw new Error('Método crear no implementado');
  }

  async obtenerPorId(id) {
    throw new Error('Método obtenerPorId no implementado');
  }

  async obtenerPorEmail(email) {
    throw new Error('Método obtenerPorEmail no implementado');
  }

  async obtenerTodos() {
    throw new Error('Método obtenerTodos no implementado');
  }

  async actualizar(id, usuario) {
    throw new Error('Método actualizar no implementado');
  }

  async eliminar(id) {
    throw new Error('Método eliminar no implementado');
  }
}

module.exports = IUsuarioRepository;