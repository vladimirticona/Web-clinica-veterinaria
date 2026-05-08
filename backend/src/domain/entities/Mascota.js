class Mascota {
  constructor({ id, nombre, especie, edad, sexo, motivo, id_dueño, producto_adicional_id, cantidad_producto }) {
    this.id = id;
    this.nombre = nombre;
    this.especie = especie ? especie.toLowerCase() : null;
    this.edad = edad;
    this.sexo = sexo;
    this.motivo = motivo;
    this.id_dueño = id_dueño;
    this.producto_adicional_id = producto_adicional_id;
    this.cantidad_producto = cantidad_producto;
  }

  validar() {
    if (!this.nombre || !this.especie || !this.edad || !this.sexo) {
      throw new Error('Faltan campos requeridos: nombre, especie, edad, sexo');
    }
  }
}

module.exports = Mascota;