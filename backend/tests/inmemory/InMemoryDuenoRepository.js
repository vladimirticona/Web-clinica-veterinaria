class InMemoryDuenoRepository {
  constructor() {
    this.data = [];
  }

  async create(dueño) {
    const copy = { ...dueño };
    copy.id = this.data.length + 1;
    this.data.push(copy);
    return copy;
  }

  async getById(id) {
    return this.data.find(d => d.id === id) || null;
  }

  clear() {
    this.data = [];
  }
}

module.exports = InMemoryDuenoRepository;
