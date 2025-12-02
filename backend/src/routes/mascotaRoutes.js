/**
 * @fileoverview Rutas para operaciones con mascotas
 * @requires express
 * @requires ../controllers/mascotaController
 * @requires ../middlewares/authMiddleware
 */

const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController');
const { verificarToken } = require('../middlewares/authMiddleware');

// ============================================
// RUTAS DE MASCOTAS (TODAS PROTEGIDAS)
// ============================================

/**
 * @swagger
 * /mascotas:
 *   get:
 *     summary: Obtener todas las mascotas con información de dueños
 *     tags:
 *       - Mascotas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mascotas con dueños
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/', verificarToken, mascotaController.obtenerTodas);

/**
 * @swagger
 * /mascotas/{id}:
 *   get:
 *     summary: Obtener mascota por ID
 *     tags:
 *       - Mascotas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mascota encontrada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Mascota no encontrada
 */
router.get('/:id', verificarToken, mascotaController.obtenerPorId);

/**
 * @swagger
 * /mascotas:
 *   post:
 *     summary: Crear nueva mascota y dueño
 *     tags:
 *       - Mascotas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['nombre', 'especie', 'edad', 'sexo', 'nombre_dueño', 'telefono', 'email']
 *             properties:
 *               nombre:
 *                 type: string
 *               especie:
 *                 type: string
 *               edad:
 *                 type: integer
 *               sexo:
 *                 type: string
 *                 enum: ['Macho', 'Hembra']
 *               nombre_dueño:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *               motivo:
 *                 type: string
 *               producto_adicional_id:
 *                 type: integer
 *               cantidad_producto:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Mascota y dueño creados exitosamente
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: No autorizado
 */
router.post('/', verificarToken, mascotaController.crear);

/**
 * @swagger
 * /mascotas/{id}:
 *   put:
 *     summary: Actualizar mascota
 *     tags:
 *       - Mascotas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               especie:
 *                 type: string
 *               edad:
 *                 type: integer
 *               sexo:
 *                 type: string
 *               motivo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mascota actualizada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Mascota no encontrada
 */
router.put('/:id', verificarToken, mascotaController.actualizar);

/**
 * @swagger
 * /mascotas/{id}:
 *   delete:
 *     summary: Eliminar mascota
 *     tags:
 *       - Mascotas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Mascota eliminada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Mascota no encontrada
 */
router.delete('/:id', verificarToken, mascotaController.eliminar);

module.exports = router;