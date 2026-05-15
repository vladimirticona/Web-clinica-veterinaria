class IUsuarioService {
  async crearUsuario(usuario) {
    throw new Error('Método crearUsuario no implementado');
  }

  async obtenerUsuarioPorId(id) {
    throw new Error('Método obtenerUsuarioPorId no implementado');
  }

  async obtenerUsuarioPorEmail(email) {
    throw new Error('Método obtenerUsuarioPorEmail no implementado');
  }

  async obtenerTodosLosUsuarios() {
    throw new Error('Método obtenerTodosLosUsuarios no implementado');
  }

  async actualizarUsuario(id, usuario) {
    throw new Error('Método actualizarUsuario no implementado');
  }

  async eliminarUsuario(id) {
    throw new Error('Método eliminarUsuario no implementado');
  }

  async login(email, password) {
    throw new Error('Método login no implementado');
  }
}

module.exports = IUsuarioService;