/**
 * @fileoverview Repositorio específico para operaciones con usuarios
 * @requires ./GenericRepository
 */

const GenericRepository = require('./GenericRepository');
const db = require('../config/database');

/**
 * @class UsuarioRepository
 * @extends GenericRepository
 * @descripcion Repositorio especializado para operaciones con la tabla usuarios
 */
class UsuarioRepository extends GenericRepository {
    constructor() {
        super('usuarios', db);
    }

    /**
     * Obtiene un usuario por su email
     * @async
     * @param {string} email - Email del usuario a buscar
     * @returns {Promise<Object>} Usuario encontrado o undefined
     * @throws {Error} Si hay error en la base de datos
     */
    getByEmail(email) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM usuarios WHERE email = ?';
            db.query(query, [email], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    }
}

// Exportar instancia única del repositorio
module.exports = new UsuarioRepository();