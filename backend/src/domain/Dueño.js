const Email = require('./Email');
const Telefono = require('./Telefono');
const Dni = require('./Dni');

class Dueño {
    constructor(id, nombreCompleto, email, telefono, dni = null) {
        if (!nombreCompleto || typeof nombreCompleto !== 'string' || nombreCompleto.trim().length === 0) {
            throw new Error('Nombre completo inválido');
        }
        if (!(email instanceof Email)) {
            throw new Error('Email debe ser una instancia de Email');
        }
        if (!(telefono instanceof Telefono)) {
            throw new Error('Telefono debe ser una instancia de Telefono');
        }
        if (dni && !(dni instanceof Dni)) {
            throw new Error('Dni debe ser una instancia de Dni');
        }
        this._id = id;
        this._nombreCompleto = nombreCompleto.trim();
        this._email = email;
        this._telefono = telefono;
        this._dni = dni;
        Object.freeze(this);
    }

    get id() { return this._id; }
    get nombreCompleto() { return this._nombreCompleto; }
    get email() { return this._email; }
    get telefono() { return this._telefono; }
    get dni() { return this._dni; }

    // Método para actualizar teléfono
    cambiarTelefono(nuevoTelefono) {
        if (!(nuevoTelefono instanceof Telefono)) {
            throw new Error('Nuevo teléfono debe ser instancia de Telefono');
        }
        return new Dueño(this._id, this._nombreCompleto, this._email, nuevoTelefono, this._dni);
    }

    equals(other) {
        return other instanceof Dueño && other.id === this.id;
    }

    toString() {
        return `Dueño: ${this.nombreCompleto}`;
    }
}

module.exports = Dueño;