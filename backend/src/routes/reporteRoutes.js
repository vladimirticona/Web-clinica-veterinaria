/**
 * @fileoverview Rutas para generación de reportes
 * @requires express
 * @requires ../controllers/reporteController
 * @requires ../middlewares/authMiddleware
 */

const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const { verificarToken } = require('../middlewares/authMiddleware');

// ============================================
// RUTAS DE REPORTES (TODAS PROTEGIDAS)
// ============================================

/**
 * @swagger
 * /reportes/estadisticas:
 *   get:
 *     summary: Obtener estadísticas completas
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *       401:
 *         description: No autorizado
 */
router.get('/estadisticas', verificarToken, reporteController.obtenerEstadisticas);

module.exports = router;