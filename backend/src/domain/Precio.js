class Precio {
    constructor(amount) {
        if (typeof amount !== 'number' || Number.isNaN(amount) || amount < 0) {
            throw new Error('Precio inválido');
        }
        this._amount = amount;
        Object.freeze(this);
    }

    get amount() {
        return this._amount;
    }

    equals(other) {
        return other instanceof Precio && other.amount === this.amount;
    }

    toString() {
        return this.amount.toFixed(2);
    }
}

module.exports = Precio;