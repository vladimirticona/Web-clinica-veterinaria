/**
 * @fileoverview Middleware para verificación de tokens JWT
 * @requires jsonwebtoken
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');

// ============================================
// MIDDLEWARE - VERIFICAR JWT
// ============================================

/**
 * Middleware para verificar y validar tokens JWT
 * 
 * @function verificarToken
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para continuar al siguiente middleware
 * @returns {void}
 * @descripcion Verifica que el token sea válido y no haya expirado
 * 
 * @ejemplo
 * app.get('/ruta-protegida', verificarToken, (req, res) => {
 *   // req.usuario contiene los datos del usuario
 * });
 */
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            error: 'No autorizado',
            mensaje: 'Token no proporcionado'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                error: 'Token inválido',
                mensaje: 'El token ha expirado o es inválido'
            });
        }
        req.usuario = decoded;
        next();
    });
};

module.exports = { verificarToken };