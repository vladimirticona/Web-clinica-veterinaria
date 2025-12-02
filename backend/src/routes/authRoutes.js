/**
 * @fileoverview Rutas para autenticación de usuarios
 * @requires express
 * @requires ../controllers/authController
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ============================================
// RUTAS DE AUTENTICACIÓN
// ============================================

/**
 * @swagger
 * /auth/registro:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['nombre_completo', 'email', 'contraseña']
 *             properties:
 *               nombre_completo:
 *                 type: string
 *                 example: "Roberto Paz"
 *               email:
 *                 type: string
 *                 example: "roberto@gmail.com"
 *               contraseña:
 *                 type: string
 *                 example: "MiPassword123"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos incompletos o email ya existe
 *       500:
 *         description: Error en el servidor
 */
router.post('/registro', authController.registro);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['email', 'contraseña']
 *             properties:
 *               email:
 *                 type: string
 *                 example: "roberto@gmail.com"
 *               contraseña:
 *                 type: string
 *                 example: "MiPassword123"
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token JWT
 *       400:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error en el servidor
 */
router.post('/login', authController.login);

module.exports = router;