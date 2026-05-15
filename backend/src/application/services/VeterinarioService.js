const IVeterinarioService = require('../../domain/ports/IVeterinarioService');
const Veterinario = require('../../domain/entities/Veterinario');

class VeterinarioService extends IVeterinarioService {
  constructor(veterinarioRepository) {
    super();
    this.veterinarioRepository = veterinarioRepository;
  }

  async crearVeterinario(veterinarioData) {
    const veterinario = new Veterinario(null, veterinarioData.nombre, veterinarioData.especialidad, veterinarioData.telefono, veterinarioData.email, veterinarioData.licencia);
    veterinario.validar();
    return await this.veterinarioRepository.crear(veterinario);
  }

  async obtenerVeterinarioPorId(id) {
    return await this.veterinarioRepository.obtenerPorId(id);
  }

  async obtenerVeterinariosPorEspecialidad(especialidad) {
    return await this.veterinarioRepository.obtenerPorEspecialidad(especialidad);
  }

  async obtenerTodosLosVeterinarios() {
    return await this.veterinarioRepository.obtenerTodos();
  }

  async actualizarVeterinario(id, veterinarioData) {
    const veterinarioExistente = await this.veterinarioRepository.obtenerPorId(id);
    if (!veterinarioExistente) throw new Error('Veterinario no encontrado');

    const veterinario = new Veterinario(veterinarioExistente.id, veterinarioExistente.nombre, veterinarioExistente.especialidad, veterinarioExistente.telefono, veterinarioExistente.email, veterinarioExistente.licencia);

    if (veterinarioData.nombre) veterinario.cambiarNombre(veterinarioData.nombre);
    if (veterinarioData.especialidad) veterinario.cambiarEspecialidad(veterinarioData.especialidad);
    if (veterinarioData.telefono) veterinario.cambiarTelefono(veterinarioData.telefono);
    if (veterinarioData.email) veterinario.cambiarEmail(veterinarioData.email);

    veterinario.validar();

    return await this.veterinarioRepository.actualizar(id, {
      nombre: veterinario.nombre,
      especialidad: veterinario.especialidad,
      telefono: veterinario.telefono,
      email: veterinario.email,
      licencia: veterinario.licencia
    });
  }

  async eliminarVeterinario(id) {
    return await this.veterinarioRepository.eliminar(id);
  }
}

module.exports = VeterinarioService;