class Email {
    constructor(value) {
        if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
            throw new Error('Email inválido');
        }
        this._value = value.trim().toLowerCase();
        Object.freeze(this);
    }

    get value() {
        return this._value;
    }

    equals(other) {
        return other instanceof Email && other.value === this.value;
    }

    toString() {
        return this.value;
    }
}

module.exports = Email;