class Usuario {
  constructor(id, nombre, email, password, rol = 'usuario') {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.rol = rol;
  }

  validar() {
    if (!this.nombre || !this.email || !this.password) {
      throw new Error('Nombre, email y password son requeridos');
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

  cambiarEmail(nuevoEmail) {
    if (!nuevoEmail || !nuevoEmail.includes('@')) {
      throw new Error('Email inválido');
    }
    this.email = nuevoEmail.toLowerCase().trim();
  }

  cambiarPassword(nuevaPassword) {
    if (!nuevaPassword || nuevaPassword.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    this.password = nuevaPassword;
  }

  cambiarRol(nuevoRol) {
    const rolesValidos = ['usuario', 'admin', 'veterinario'];
    if (!rolesValidos.includes(nuevoRol)) {
      throw new Error('Rol inválido');
    }
    this.rol = nuevoRol;
  }

  esAdmin() {
    return this.rol === 'admin';
  }

  esVeterinario() {
    return this.rol === 'veterinario';
  }

  obtenerPerfilPublico() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      rol: this.rol
    };
  }
}

module.exports = Usuario;