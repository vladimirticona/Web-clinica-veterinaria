/**
 * @fileoverview Controlador para operaciones con reservaciones/citas
 * @requires ../models/reservacionRepository
 * @requires ../models/productoRepository
 */

const reservacionRepository = require('../models/reservacionRepository');
const productoRepository = require('../models/productoRepository');

const reservacionController = {
    // ============================================
    // OBTENER TODAS LAS RESERVACIONES
    // ============================================

    /**
     * GET /reservaciones
     * @async
     * @param {Object} req - Solicitud HTTP
     * @param {Object} res - Respuesta HTTP
     * @returns {Array} Lista de reservaciones
     * @description Obtiene todas las reservaciones/citas del sistema
     */
    async obtenerTodas(req, res) {
        try {
            const reservaciones = await reservacionRepository.getAllConProductos();
            res.status(200).json(reservaciones);
        } catch(error) {
            res.status(500).json({
                error: 'Error al obtener las reservaciones',
                mensaje: error.message
            });
        }
    },

    // ============================================
    // CREAR NUEVA RESERVACIÓN
    // ============================================

    /**
     * POST /reservaciones
     * @async
     * @param {Object} req - Solicitud HTTP
     * @param {Object} res - Respuesta HTTP
     * @returns {Object} Reservación creada
     * @description Crea una nueva reservación/cita
     */
    async crear(req, res) {
        try {
            const { 
                nombre_cliente, telefono, email, nombre_mascota, especie, 
                motivo_consulta, fecha_solicitada, hora_solicitada, tipo_cita,
                producto_adicional_id, cantidad_producto 
            } = req.body;

            // PROGRAMACIÓN DEFENSIVA: Validar campos requeridos
            if (!nombre_cliente || !telefono || !email || !nombre_mascota || !especie || 
                !motivo_consulta || !fecha_solicitada || !hora_solicitada || !tipo_cita) {
                return res.status(400).json({
                    error: 'Datos incompletos',
                    mensaje: 'Se requieren todos los campos: nombre_cliente, telefono, email, nombre_mascota, especie, motivo_consulta, fecha_solicitada, hora_solicitada, tipo_cita'
                });
            }

            // Preparar datos de la reservación
            const datosReservacion = {
                nombre_cliente,
                telefono,
                email,
                nombre_mascota,
                especie: especie.toLowerCase(),
                motivo_consulta,
                fecha_solicitada,
                hora_solicitada,
                tipo_cita,
                estado: 'pendiente'
            };

            // Agregar campos opcionales si están presentes
            if (producto_adicional_id) datosReservacion.producto_adicional_id = producto_adicional_id;
            if (cantidad_producto) datosReservacion.cantidad_producto = cantidad_producto;

            const nuevaReservacion = await reservacionRepository.create(datosReservacion);

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
                mensaje: 'Reservación creada exitosamente',
                reservacion: nuevaReservacion
            });
        } catch(error) {
            res.status(500).json({
                error: 'Error al crear la reservación',
                mensaje: error.message
            });
        }
    },

    // ============================================
    // ACTUALIZAR ESTADO DE RESERVACIÓN
    // ============================================

    /**
     * PUT /reservaciones/:id/estado
     * @async
     * @param {Object} req - Solicitud HTTP
     * @param {Object} res - Respuesta HTTP
     * @returns {Object} Reservación actualizada
     * @description Actualiza el estado de una reservación
     */
    async actualizarEstado(req, res) {
        try {
            const { id } = req.params;
            const { estado } = req.body;

            // PROGRAMACIÓN DEFENSIVA: Validar estado
            const estadosValidos = ['pendiente', 'confirmada', 'cancelada', 'reprogramar'];
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({
                    error: 'Estado inválido',
                    mensaje: 'El estado debe ser: pendiente, confirmada, cancelada o reprogramar'
                });
            }

            const resultado = await reservacionRepository.update(id, { estado });
            
            res.status(200).json({
                mensaje: 'Estado actualizado exitosamente',
                reservacion: resultado
            });
        } catch(error) {
            if (error.message === 'Registro no encontrado') {
                return res.status(404).json({
                    error: 'Reservación no encontrada'
                });
            }
            res.status(500).json({
                error: 'Error al actualizar el estado',
                mensaje: error.message
            });
        }
    },

    // ============================================
    // ELIMINAR RESERVACIÓN
    // ============================================

    /**
     * DELETE /reservaciones/:id
     * @async
     * @param {Object} req - Solicitud HTTP
     * @param {Object} res - Respuesta HTTP
     * @returns {void}
     * @description Elimina una reservación del sistema
     */
    async eliminar(req, res) {
        try {
            const { id } = req.params;
            
            await reservacionRepository.delete(id);
            res.status(204).send();
        } catch(error) {
            if (error.message === 'Registro no encontrado') {
                return res.status(404).json({
                    error: 'Reservación no encontrada'
                });
            }
            res.status(500).json({
                error: 'Error al eliminar la reservación',
                mensaje: error.message
            });
        }
    }
};

module.exports = reservacionController;