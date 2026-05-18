class InMemoryDuenoRepository {
  constructor() {
    this.duenos = [];
    this.nextId = 1;
  }

  create(datos) {
    const dueno = {
      id: this.nextId++,
      ...datos
    };
    this.duenos.push(dueno);
    return dueno;
  }

  getById(id) {
    return this.duenos.find(d => d.id === Number(id)) || null;
  }
}

module.exports = InMemoryDuenoRepository;
