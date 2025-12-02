/**
 * @fileoverview Repositorio específico para operaciones con mascotas
 * @requires ./GenericRepository
 */

const GenericRepository = require('./GenericRepository');
const db = require('../config/database');

/**
 * @class MascotaRepository
 * @extends GenericRepository
 * @descripcion Repositorio especializado para operaciones con la tabla mascotas
 */
class MascotaRepository extends GenericRepository {
    constructor() {
        super('mascotas', db);
    }

    /**
     * Obtiene todas las mascotas con información de dueños y productos
     * @async
     * @returns {Promise<Array>} Lista de mascotas con información relacionada
     */
    getMascotasConDueños() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT m.*, d.nombre_completo as nombre_dueño, d.telefono, d.email as email_dueño,
                       p.nombre as nombre_producto, p.precio as precio_producto
                FROM mascotas m
                LEFT JOIN dueños d ON m.id_dueño = d.id
                LEFT JOIN productos p ON m.producto_adicional_id = p.id
                ORDER BY m.fecha_creacion DESC
            `;
            db.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    /**
     * Obtiene una mascota específica con información de dueño y producto
     * @async
     * @param {number} id - ID de la mascota
     * @returns {Promise<Object>} Mascota con información relacionada
     */
    getMascotaConDueño(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT m.*, d.nombre_completo as nombre_dueño, d.telefono, d.email as email_dueño,
                       p.nombre as nombre_producto, p.precio as precio_producto
                FROM mascotas m
                LEFT JOIN dueños d ON m.id_dueño = d.id
                LEFT JOIN productos p ON m.producto_adicional_id = p.id
                WHERE m.id = ?
            `;
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    }
}

module.exports = new MascotaRepository();