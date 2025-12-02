/**
 * @fileoverview Constantes globales de la aplicación
 */

// ============================================
// CONSTANTES DE CONFIGURACIÓN
// ============================================

/**
 * Clave secreta para firmar tokens JWT
 * @const {string} JWT_SECRET
 * @description En producción, cambiar por una clave aleatoria y segura
 */
const JWT_SECRET = 'tu_clave_secreta_super_segura_2024';

/**
 * Puerto del servidor
 * @const {number} PORT
 */
const PORT = process.env.PORT || 3000;

module.exports = {
    JWT_SECRET,
    PORT
};