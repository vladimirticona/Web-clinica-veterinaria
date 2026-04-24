class Mascota {
    constructor(id, nombre, fechaCreacion, idDueño, idProducto = null) {
        if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
            throw new Error('Nombre de mascota inválido');
        }
        if (!idDueño) {
            throw new Error('La mascota debe tener un dueño');
        }
        this._id = id || null;
        this._nombre = nombre.trim();
        this._fechaCreacion = fechaCreacion || new Date();
        this._idDueño = idDueño;
        this._idProducto = idProducto;
        Object.freeze(this);
    }

    get id() { return this._id; }
    get nombre() { return this._nombre; }
    get fechaCreacion() { return this._fechaCreacion; }
    get idDueño() { return this._idDueño; }
    get idProducto() { return this._idProducto; }

    // Método para cambiar producto adicional
    cambiarProducto(idProducto) {
        // Crear nueva instancia con el cambio, ya que es inmutable
        return new Mascota(this._id, this._nombre, this._fechaCreacion, this._idDueño, idProducto);
    }

    equals(other) {
        return other instanceof Mascota && other.id === this.id;
    }

    toString() {
        return `Mascota: ${this.nombre}`;
    }
}

module.exports = Mascota;