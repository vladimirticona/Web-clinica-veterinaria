class Telefono {
    constructor(value) {
        const normalized = String(value).replace(/\D+/g, '');
        if (!/^\d{7,15}$/.test(normalized)) {
            throw new Error('Teléfono inválido');
        }
        this._value = normalized;
        Object.freeze(this);
    }

    get value() {
        return this._value;
    }

    equals(other) {
        return other instanceof Telefono && other.value === this.value;
    }
}

module.exports = Telefono;