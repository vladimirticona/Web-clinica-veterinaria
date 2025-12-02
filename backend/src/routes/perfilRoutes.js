/**
 * @fileoverview Rutas para operaciones del perfil de usuario
 * @requires express
 * @requires ../controllers/perfilController
 * @requires ../middlewares/authMiddleware
 */

const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const { verificarToken } = require('../middlewares/authMiddleware');

// ============================================
// RUTAS DE PERFIL (TODAS PROTEGIDAS)
// ============================================

/**
 * @swagger
 * /perfil/actualizar:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags:
 *       - Perfil
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_completo:
 *                 type: string
 *               email:
 *                 type: string
 *               contraseña_actual:
 *                 type: string
 *               contraseña_nueva:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *       400:
 *         description: Datos inválidos o contraseña incorrecta
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.put('/actualizar', verificarToken, perfilController.actualizar);

module.exports = router;