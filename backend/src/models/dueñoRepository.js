/**
 * @fileoverview Repositorio específico para operaciones con dueños
 * @requires ./GenericRepository
 */

const GenericRepository = require('./GenericRepository');
const db = require('../config/database');

/**
 * @class DueñoRepository
 * @extends GenericRepository
 * @descripcion Repositorio especializado para operaciones con la tabla dueños
 */
class DueñoRepository extends GenericRepository {
    constructor() {
        super('dueños', db);
    }
}

// Exportar instancia única del repositorio
module.exports = new DueñoRepository();