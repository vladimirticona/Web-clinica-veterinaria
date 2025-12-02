/**
 * @fileoverview Controlador para operaciones con mascotas
 * @requires ../models/mascotaRepository
 * @requires ../models/dueñoRepository
 * @requires ../models/productoRepository
 */

const mascotaRepository = require('../models/mascotaRepository');
const dueñoRepository = require('../models/dueñoRepository');
const productoRepository = require('../models/productoRepository');

const mascotaController = {
    // ============================================
    // OBTENER TODAS LAS MASCOTAS
    // ============================================

    /**
     * GET /mascotas
     * @async
     * @param {Object} req - Solicitud HTTP (requiere token en Authorization)
     * @param {Object} res - Respuesta HTTP
     * @returns {Array} Lista de todas las mascotas con información de dueños
     * @description Obtiene la lista completa de mascotas con información de dueños (requiere autenticación)
     */
    async obtenerTodas(req, res) {
        try {
            const mascotas = await mascotaRepository.getMascotasConDueños();
            res.status(200).json(mascotas);
        } catch(error) {
            res.status(500).json({
                error: 'Error al obtener las mascotas',
                mensaje: error.message
            });
        }
    },

    // ============================================
    // OBTENER MASCOTA POR ID
    // ============================================

    /**
     * GET /mascotas/:id
     * @async
     * @param {Object} req - Solicitud HTTP con ID en params
     * @param {Object} res - Respuesta HTTP
     * @returns {Object} La mascota solicitada con información del dueño
     * @description Obtiene una mascota específica por su ID
     */
    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const mascota = await mascotaRepository.getMascotaConDueño(id);
            
            if (!mascota) {
                return res.status(404).json({
                    error: 'Mascota no encontrada'
                });
            }
            
            res.status(200).json(mascota);
        } catch(error) {
            res.status(500).json({
                error: 'Error al obtener la mascota',
                mensaje: error.message
            });
        }
    },

    // ============================================
    // CREAR NUEVA MASCOTA Y DUEÑO
    // ============================================

    /**
     * POST /mascotas
     * @async
     * @param {Object} req - Solicitud HTTP con datos de mascota y dueño
     * @param {string} req.body.nombre - Nombre de la mascota
     * @param {string} req.body.especie - Especie de la mascota (convertida a minúsculas)
     * @param {number} req.body.edad - Edad de la mascota
     * @param {string} req.body.sexo - Sexo de la mascota (Macho/Hembra)
     * @param {string} req.body.nombre_dueño - Nombre del dueño
     * @param {string} req.body.telefono - Teléfono del dueño
     * @param {string} req.body.email - Email del dueño
     * @param {string} req.body.motivo - Motivo de la consulta
     * @param {number} req.body.producto_adicional_id - ID del producto adicional
     * @param {number} req.body.cantidad_producto - Cantidad del producto
     * @param {Object} res - Respuesta HTTP
     * @returns {Object} Mascota y dueño creados
     * @description Crea un nuevo dueño y mascota en el sistema
     */
    async crear(req, res) {
        try {
            const { nombre, especie, edad, sexo, nombre_dueño, telefono, email, motivo, producto_adicional_id, cantidad_producto } = req.body;
            
            // PROGRAMACIÓN DEFENSIVA: Validar campos requeridos
            if (!nombre || !especie || !edad || !sexo || !nombre_dueño || !telefono || !email) {
                return res.status(400).json({
                    error: 'Datos incompletos',
                    mensaje: 'Se requieren todos los campos: nombre, especie, edad, sexo, nombre_dueño, telefono, email'
                });
            }

            // Crear dueño primero
            const nuevoDueño = await dueñoRepository.create({
                nombre_completo: nombre_dueño,
                telefono,
                email
            });

            // Preparar datos de la mascota
            const datosMascota = {
                nombre,
                especie: especie.toLowerCase(),
                edad,
                sexo,
                id_dueño: nuevoDueño.id
            };

            // Agregar campos opcionales si están presentes
            if (motivo) datosMascota.motivo = motivo;
            if (producto_adicional_id) datosMascota.producto_adicional_id = producto_adicional_id;
            if (cantidad_producto) datosMascota.cantidad_producto = cantidad_producto;

            // Crear mascota
            const nuevaMascota = await mascotaRepository.create(datosMascota);

            // Si se seleccionó un producto, actualizar el stock
            if (producto_adicional_id && cantidad_producto) {
                const producto = await productoRepository.getById(producto_adicional_id);
                if (producto) {
                    const nuevaCantidad = producto.cantidad - cantidad_producto;
                    if (nuevaCantidad >= 0) {
                        await productoRepository.update(producto_adicional_id, { cantidad: nuevaCantidad });
                    }
                }
            }

            res.status(201).json({
                mensaje: 'Mascota y dueño registrados exitosamente',
                mascota: nuevaMascota,
                dueño: nuevoDueño
            });
        } catch(error) {
            res.status(500).json({
                error: 'Error al crear la mascota',
                mensaje: error.message
            });
        }
    },

    // ============================================
    // ACTUALIZAR MASCOTA
    // ============================================

    /**
     * PUT /mascotas/:id
     * @async
     * @param {Object} req - Solicitud HTTP con datos actualizados
     * @param {Object} res - Respuesta HTTP
     * @returns {Object} Mascota actualizada
     * @description Actualiza los datos de una mascota existente
     */
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { nombre, especie, edad, sexo, motivo } = req.body;

            const datosActualizar = {};
            if (nombre) datosActualizar.nombre = nombre;
            if (especie) datosActualizar.especie = especie.toLowerCase();
            if (edad) datosActualizar.edad = edad;
            if (sexo) datosActualizar.sexo = sexo;
            if (motivo !== undefined) datosActualizar.motivo = motivo;

            const resultado = await mascotaRepository.update(id, datosActualizar);
            
            res.status(200).json(resultado);
        } catch(error) {
            if (error.message === 'Registro no encontrado') {
                return res.status(404).json({
                    error: 'Mascota no encontrada'
                });
            }
            res.status(500).json({
                error: 'Error al actualizar la mascota',
                mensaje: error.message
            });
        }
    },

    // ============================================
    // ELIMINAR MASCOTA
    // ============================================

    /**
     * DELETE /mascotas/:id
     * @async
     * @param {Object} req - Solicitud HTTP con ID en params
     * @param {Object} res - Respuesta HTTP
     * @returns {void}
     * @description Elimina una mascota del sistema
     */
    async eliminar(req, res) {
        try {
            const { id } = req.params;
            
            // Primero obtener el id_dueño para eliminar también el dueño si no tiene más mascotas
            const mascota = await mascotaRepository.getById(id);
            if (!mascota) {
                return res.status(404).json({
                    error: 'Mascota no encontrada'
                });
            }

            const id_dueño = mascota.id_dueño;

            // Eliminar la mascota
            await mascotaRepository.delete(id);

            // Verificar si el dueño tiene más mascotas
            const db = require('../config/database');
            const query = 'SELECT COUNT(*) as count FROM mascotas WHERE id_dueño = ?';
            db.query(query, [id_dueño], (err, results) => {
                if (err) {
                    console.error('Error al verificar mascotas del dueño:', err);
                    return res.status(204).send(); // Aún así retornamos éxito
                }

                // Si no tiene más mascotas, eliminar el dueño
                if (results[0].count === 0) {
                    dueñoRepository.delete(id_dueño)
                        .catch(err => console.error('Error al eliminar dueño:', err));
                }

                res.status(204).send();
            });
        } catch(error) {
            if (error.message === 'Registro no encontrado') {
                return res.status(404).json({
                    error: 'Mascota no encontrada'
                });
            }
            res.status(500).json({
                error: 'Error al eliminar la mascota',
                mensaje: error.message
            });
        }
    }
};

module.exports = mascotaController;