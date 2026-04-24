class Dni {
    constructor(value) {
        const str = String(value).trim();
        if (!/^\d{8}$/.test(str)) {
            throw new Error('DNI inválido');
        }
        this._value = str;
        Object.freeze(this);
    }

    get value() {
        return this._value;
    }

    equals(other) {
        return other instanceof Dni && other.value === this.value;
    }
}

module.exports = Dni;