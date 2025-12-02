/**
 * @fileoverview Controlador para autenticación de usuarios
 * @requires bcryptjs
 * @requires jsonwebtoken
 * @requires ../models/usuarioRepository
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioRepository = require('../models/usuarioRepository');
const { JWT_SECRET } = require('../utils/constants');

const authController = {
    // ============================================
    // REGISTRO DE USUARIO
    // ============================================

    /**
     * POST /auth/registro
     * @async
     * @param {Object} req - Solicitud HTTP
     * @param {string} req.body.nombre_completo - Nombre completo del usuario
     * @param {string} req.body.email - Email del usuario (único)
     * @param {string} req.body.contraseña - Contraseña (será encriptada)
     * @param {Object} res - Respuesta HTTP
     * @returns {Object} Usuario creado (sin contraseña)
     * @description Registra un nuevo usuario en el sistema
     */
    async registro(req, res) {
        try {
            const { nombre_completo, email, contraseña } = req.body;

            // ASERCIONES PARA VALIDAR DATOS DE ENTRADA
            console.assert(nombre_completo && nombre_completo.trim().length > 0,
                'Nombre completo es requerido y no puede estar vacío');
            console.assert(email && email.includes('@') && email.includes('.'),
                'Email debe tener formato válido', email);
            console.assert(contraseña && contraseña.length >= 6,
                'Contraseña debe tener al menos 6 caracteres');
            
            // PROGRAMACIÓN DEFENSIVA: Validar datos requeridos
            if (!nombre_completo || !email || !contraseña) {
                return res.status(400).json({
                    error: 'Datos incompletos',
                    mensaje: 'Se requieren: nombre_completo, email, contraseña'
                });
            }

            // Encriptar contraseña
            const hashedPassword = await bcrypt.hash(contraseña, 10);

            const nuevoUsuario = await usuarioRepository.create({
                nombre_completo,
                email,
                contraseña: hashedPassword,
                rol: 'usuario'
            });

            // No retornar la contraseña
            delete nuevoUsuario.contraseña;

            res.status(201).json({
                mensaje: 'Usuario registrado exitosamente',
                usuario: nuevoUsuario
            });
        } catch(error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    error: 'El email ya está registrado'
                });
            }
            res.status(500).json({
                error: 'Error al registrar usuario',
                mensaje: error.message
            });
        }
    },

    // ============================================
    // INICIO DE SESIÓN
    // ============================================

    /**
     * POST /auth/login
     * @async
     * @param {Object} req - Solicitud HTTP
     * @param {string} req.body.email - Email del usuario
     * @param {string} req.body.contraseña - Contraseña del usuario
     * @param {Object} res - Respuesta HTTP
     * @returns {Object} Token JWT y datos del usuario
     * @description Autentica un usuario por email y retorna un token JWT válido por 24 horas
     */
    async login(req, res) {
        try {
            const { email, contraseña } = req.body;

            // ASERCIONES PARA CREDENCIALES
            console.assert(email && email.trim(), 'Email no puede estar vacío');
            console.assert(contraseña && contraseña.trim(), 'Contraseña no puede estar vacía');

            if (!email || !contraseña) {
                return res.status(400).json({
                    error: 'Credenciales incompletas'
                });
            }

            // Buscar usuario por email
            const usuario = await usuarioRepository.getByEmail(email);

            if (!usuario) {
                return res.status(400).json({
                    error: 'Credenciales inválidas'
                });
            }

            // Comparar contraseñas
            const esValida = await bcrypt.compare(contraseña, usuario.contraseña);

            if (!esValida) {
                return res.status(400).json({
                    error: 'Credenciales inválidas'
                });
            }

            // Crear token JWT válido por 24 horas
            const token = jwt.sign(
                {
                    id: usuario.id,
                    nombre_completo: usuario.nombre_completo,
                    email: usuario.email,
                    rol: usuario.rol
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(200).json({
                mensaje: 'Login exitoso',
                token,
                usuario: {
                    id: usuario.id,
                    nombre_completo: usuario.nombre_completo,
                    email: usuario.email,
                    rol: usuario.rol
                }
            });
        } catch(error) {
            res.status(500).json({
                error: 'Error al iniciar sesión',
                mensaje: error.message
            });
        }
    }
};

module.exports = authController;