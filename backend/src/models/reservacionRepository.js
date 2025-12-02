/**
 * @fileoverview Repositorio específico para operaciones con reservaciones
 * @requires ./GenericRepository
 */

const GenericRepository = require('./GenericRepository');
const db = require('../config/database');

/**
 * @class ReservacionRepository
 * @extends GenericRepository
 * @descripcion Repositorio especializado para operaciones con la tabla reservaciones
 */
class ReservacionRepository extends GenericRepository {
    constructor() {
        super('reservaciones', db);
    }

    /**
     * Obtiene todas las reservaciones con información de productos asociados
     * @async
     * @returns {Promise<Array>} Lista de reservaciones con información de productos
     * @throws {Error} Si hay error en la base de datos
     */
    getAllConProductos() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT r.*, p.nombre as nombre_producto, p.precio as precio_producto
                FROM reservaciones r
                LEFT JOIN productos p ON r.producto_adicional_id = p.id
                ORDER BY r.fecha_solicitada DESC, r.hora_solicitada DESC
            `;
            db.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }
}

// Exportar instancia única del repositorio
module.exports = new ReservacionRepository();