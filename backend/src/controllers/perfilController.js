/**
 * @fileoverview Controlador para operaciones del perfil de usuario
 * @requires bcryptjs
 * @requires ../config/database
 */

const bcrypt = require('bcryptjs');
const db = require('../config/database');

const perfilController = {
    // ============================================
    // ACTUALIZAR PERFIL DE USUARIO
    // ============================================

    /**
     * PUT /perfil/actualizar
     * @async
     * @param {Object} req - Solicitud HTTP
     * @param {string} req.body.nombre_completo - Nuevo nombre completo
     * @param {string} req.body.email - Nuevo email
     * @param {string} req.body.contraseña_actual - Contraseña actual (si cambia contraseña)
     * @param {string} req.body.contraseña_nueva - Nueva contraseña
     * @param {Object} res - Respuesta HTTP
     * @returns {Object} Usuario actualizado
     * @description Actualiza el perfil del usuario autenticado
     */
    async actualizar(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const { nombre_completo, email, contraseña_actual, contraseña_nueva } = req.body;

            // Validar que al menos un campo sea proporcionado
            if (!nombre_completo && !email && !contraseña_nueva) {
                return res.status(400).json({
                    error: 'Debes proporcionar al menos un campo a actualizar'
                });
            }

            // Obtener usuario actual
            const queryObtener = 'SELECT * FROM usuarios WHERE id = ?';
            db.query(queryObtener, [usuarioId], async (err, results) => {
                if (err) {
                    return res.status(500).json({
                        error: 'Error en el servidor'
                    });
                }

                if (results.length === 0) {
                    return res.status(404).json({
                        error: 'Usuario no encontrado'
                    });
                }

                const usuarioActual = results[0];
                const datosActualizar = {};

                // Actualizar nombre
                if (nombre_completo && nombre_completo.trim()) {
                    datosActualizar.nombre_completo = nombre_completo;
                }

                // Actualizar email
                if (email && email.trim()) {
                    datosActualizar.email = email;
                }

                // Actualizar contraseña
                if (contraseña_nueva) {
                    // Validar que proporcione contraseña actual
                    if (!contraseña_actual) {
                        return res.status(400).json({
                            error: 'Debes proporcionar tu contraseña actual para cambiarla'
                        });
                    }

                    // Verificar contraseña actual
                    const esValida = await bcrypt.compare(contraseña_actual, usuarioActual.contraseña);
                    if (!esValida) {
                        return res.status(400).json({
                            error: 'La contraseña actual es incorrecta'
                        });
                    }

                    // Encriptar nueva contraseña
                    const hashedPassword = await bcrypt.hash(contraseña_nueva, 10);
                    datosActualizar.contraseña = hashedPassword;
                }

                // Actualizar en BD
                const queryActualizar = 'UPDATE usuarios SET ? WHERE id = ?';
                db.query(queryActualizar, [datosActualizar, usuarioId], (err, results) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(400).json({
                                error: 'El email ya está registrado'
                            });
                        }
                        return res.status(500).json({
                            error: 'Error al actualizar el perfil'
                        });
                    }

                    // Retornar usuario actualizado
                    const usuarioActualizado = {
                        id: usuarioId,
                        nombre_completo: datosActualizar.nombre_completo || usuarioActual.nombre_completo,
                        email: datosActualizar.email || usuarioActual.email,
                        rol: usuarioActual.rol
                    };

                    res.status(200).json({
                        mensaje: 'Perfil actualizado exitosamente',
                        usuario: usuarioActualizado
                    });
                });
            });
        } catch(error) {
            res.status(500).json({
                error: 'Error al actualizar el perfil',
                mensaje: error.message
            });
        }
    }
};

module.exports = perfilController;