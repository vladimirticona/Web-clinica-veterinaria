/**
 * @fileoverview Rutas para operaciones con reservaciones
 * @requires express
 * @requires ../controllers/reservacionController
 * @requires ../middlewares/authMiddleware
 */

const express = require('express');
const router = express.Router();
const reservacionController = require('../controllers/reservacionController');
const { verificarToken } = require('../middlewares/authMiddleware');

// ============================================
// RUTAS DE RESERVACIONES (TODAS PROTEGIDAS)
// ============================================

/**
 * @swagger
 * /reservaciones:
 *   get:
 *     summary: Obtener todas las reservaciones
 *     tags:
 *       - Reservaciones
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservaciones
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/', verificarToken, reservacionController.obtenerTodas);

/**
 * @swagger
 * /reservaciones:
 *   post:
 *     summary: Crear nueva reservación
 *     tags:
 *       - Reservaciones
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['nombre_cliente', 'telefono', 'email', 'nombre_mascota', 'especie', 'motivo_consulta', 'fecha_solicitada', 'hora_solicitada', 'tipo_cita']
 *             properties:
 *               nombre_cliente:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *               nombre_mascota:
 *                 type: string
 *               especie:
 *                 type: string
 *               motivo_consulta:
 *                 type: string
 *               fecha_solicitada:
 *                 type: string
 *                 format: date
 *               hora_solicitada:
 *                 type: string
 *                 format: time
 *               tipo_cita:
 *                 type: string
 *                 enum: ['presencial', 'domicilio']
 *               producto_adicional_id:
 *                 type: integer
 *               cantidad_producto:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reservación creada exitosamente
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: No autorizado
 */
router.post('/', verificarToken, reservacionController.crear);

/**
 * @swagger
 * /reservaciones/{id}/estado:
 *   put:
 *     summary: Actualizar estado de reservación
 *     tags:
 *       - Reservaciones
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
 *             required: ['estado']
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: ['pendiente', 'confirmada', 'cancelada', 'reprogramar']
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reservación no encontrada
 */
router.put('/:id/estado', verificarToken, reservacionController.actualizarEstado);

/**
 * @swagger
 * /reservaciones/{id}:
 *   delete:
 *     summary: Eliminar reservación
 *     tags:
 *       - Reservaciones
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
 *         description: Reservación eliminada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reservación no encontrada
 */
router.delete('/:id', verificarToken, reservacionController.eliminar);

module.exports = router;