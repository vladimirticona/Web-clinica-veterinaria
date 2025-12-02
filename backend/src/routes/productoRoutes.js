/**
 * @fileoverview Rutas para operaciones con productos
 * @requires express
 * @requires ../controllers/productoController
 * @requires ../middlewares/authMiddleware
 */

const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { verificarToken } = require('../middlewares/authMiddleware');

// ============================================
// RUTAS DE PRODUCTOS (TODAS PROTEGIDAS)
// ============================================

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/', verificarToken, productoController.obtenerTodos);

/**
 * @swagger
 * /productos/stock:
 *   get:
 *     summary: Obtener productos con stock disponible
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos con stock
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/stock', verificarToken, productoController.obtenerConStock);

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear nuevo producto
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['nombre', 'precio', 'cantidad']
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *               cantidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: No autorizado
 */
router.post('/', verificarToken, productoController.crear);

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags:
 *       - Productos
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
 *               precio:
 *                 type: number
 *               cantidad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', verificarToken, productoController.actualizar);

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     tags:
 *       - Productos
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
 *         description: Producto eliminado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', verificarToken, productoController.eliminar);

module.exports = router;