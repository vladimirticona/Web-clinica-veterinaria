/**
 * @fileoverview Repositorio específico para operaciones con productos
 * @requires ./GenericRepository
 */

const GenericRepository = require('./GenericRepository');
const db = require('../config/database');

/**
 * @class ProductoRepository
 * @extends GenericRepository
 * @descripcion Repositorio especializado para operaciones con la tabla productos
 */
class ProductoRepository extends GenericRepository {
    constructor() {
        super('productos', db);
    }

    /**
     * Obtiene productos con stock disponible (cantidad > 0)
     * @async
     * @returns {Promise<Array>} Lista de productos con stock
     * @throws {Error} Si hay error en la base de datos
     */
    getConStock() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM productos WHERE cantidad > 0 ORDER BY nombre';
            db.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    /**
     * Obtiene productos con stock bajo (cantidad < 10)
     * @async
     * @returns {Promise<Array>} Lista de productos con stock bajo
     * @throws {Error} Si hay error en la base de datos
     */
    getStockBajo() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT nombre, cantidad FROM productos WHERE cantidad < 10 ORDER BY cantidad ASC';
            db.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }
}

// Exportar instancia única del repositorio
module.exports = new ProductoRepository();