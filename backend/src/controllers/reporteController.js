/**
 * @fileoverview Controlador para generación de reportes y estadísticas
 * @requires ../config/database
 */

const db = require('../config/database');

const reporteController = {
    // ============================================
    // OBTENER ESTADÍSTICAS COMPLETAS
    // ============================================

    /**
     * GET /reportes/estadisticas
     * @async
     * @param {Object} req - Solicitud HTTP
     * @param {Object} res - Respuesta HTTP
     * @returns {Object} Estadísticas completas del sistema
     * @description Obtiene estadísticas detalladas para reportes
     */
    async obtenerEstadisticas(req, res) {
        try {
            const queries = {
                totalMascotas: 'SELECT COUNT(*) as total FROM mascotas',
                totalDueños: 'SELECT COUNT(*) as total FROM dueños',
                totalProductos: 'SELECT COUNT(*) as total FROM productos',
                totalReservaciones: 'SELECT COUNT(*) as total FROM reservaciones',
                reservacionesPendientes: 'SELECT COUNT(*) as total FROM reservaciones WHERE estado = "pendiente"',
                mascotasEsteMes: `
                    SELECT COUNT(*) as total FROM mascotas 
                    WHERE MONTH(fecha_creacion) = MONTH(CURRENT_DATE()) 
                    AND YEAR(fecha_creacion) = YEAR(CURRENT_DATE())
                `,
                especiesComunes: `
                    SELECT especie, COUNT(*) as cantidad 
                    FROM mascotas 
                    GROUP BY LOWER(especie) 
                    ORDER BY cantidad DESC 
                    LIMIT 10
                `,
                distribucionSexo: `
                    SELECT sexo, COUNT(*) as cantidad 
                    FROM mascotas 
                    WHERE sexo IS NOT NULL 
                    GROUP BY sexo
                `,
                productosStockBajo: `
                    SELECT nombre, cantidad 
                    FROM productos 
                    WHERE cantidad < 10 
                    ORDER BY cantidad ASC
                `,
                reservacionesPorEstado: `
                    SELECT estado, COUNT(*) as cantidad 
                    FROM reservaciones 
                    GROUP BY estado
                `,
                distribucionEdad: `
                    SELECT 
                        CASE 
                            WHEN edad <= 1 THEN 'Cachorro (0-1 año)'
                            WHEN edad <= 3 THEN 'Joven (1-3 años)'
                            WHEN edad <= 7 THEN 'Adulto (3-7 años)'
                            ELSE 'Senior (7+ años)'
                        END as grupo_edad,
                        COUNT(*) as cantidad
                    FROM mascotas 
                    WHERE edad IS NOT NULL
                    GROUP BY grupo_edad
                    ORDER BY MIN(edad)
                `,
                mascotasPorMes: `
                    SELECT 
                        DATE_FORMAT(fecha_creacion, '%Y-%m') as mes,
                        COUNT(*) as cantidad
                    FROM mascotas 
                    WHERE fecha_creacion >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
                    GROUP BY mes
                    ORDER BY mes
                `
            };

            const resultados = {};

            for (const [key, query] of Object.entries(queries)) {
                await new Promise((resolve, reject) => {
                    db.query(query, (err, results) => {
                        if (err) reject(err);
                        else {
                            resultados[key] = results;
                            resolve();
                        }
                    });
                });
            }

            res.status(200).json(resultados);
        } catch(error) {
            res.status(500).json({
                error: 'Error al obtener estadísticas',
                mensaje: error.message
            });
        }
    }
};

module.exports = reporteController;