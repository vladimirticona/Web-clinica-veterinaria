class Veterinario {
  constructor(id, nombre, especialidad, telefono, email, licencia) {
    this.id = id;
    this.nombre = nombre;
    this.especialidad = especialidad;
    this.telefono = telefono;
    this.email = email;
    this.licencia = licencia;
  }

  validar() {
    if (!this.nombre || !this.especialidad || !this.licencia) {
      throw new Error('Nombre, especialidad y licencia son requeridos');
    }
    if (!this.email.includes('@')) {
      throw new Error('Email inválido');
    }
  }

  cambiarNombre(nuevoNombre) {
    if (!nuevoNombre || nuevoNombre.trim() === '') {
      throw new Error('El nombre no puede estar vacío');
    }
    this.nombre = nuevoNombre.trim();
  }

  cambiarTelefono(nuevoTelefono) {
    this.telefono = nuevoTelefono;
  }

  cambiarEmail(nuevoEmail) {
    if (!nuevoEmail || !nuevoEmail.includes('@')) {
      throw new Error('Email inválido');
    }
    this.email = nuevoEmail.toLowerCase().trim();
  }

  obtenerInformacionProfesional() {
    return {
      id: this.id,
      nombre: this.nombre,
      especialidad: this.especialidad,
      telefono: this.telefono,
      email: this.email,
      licencia: this.licencia
    };
  }
}

module.exports = Veterinario;