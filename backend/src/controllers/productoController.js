/**
 * @fileoverview Controlador para operaciones con productos del petshop
 * @requires ../models/productoRepository
 */

const productoRepository = require('../models/productoRepository');

const productoController = {
    // ============================================
    // OBTENER TODOS LOS PRODUCTOS
    // ============================================

    /**
     * GET /productos
     * @async
     * @param {Object} req - Solicitud HTTP
     * @param {Object} res - Respuesta HTTP
     * @returns {Array} Lista de productos
     * @description Obtiene todos los productos del petshop
     */
    async obtenerTodos(req, res) {
        try {
            const productos = await productoRepository.getAll();
            res.status(200).json(productos);
        } catch(error) {
            res.status(500).json({
                error: 'Error al obtener los productos',
                mensaje: error.message
            });
        }
    },

    // ============================================
    // OBTENER PRODUCTOS CON STOCK DISPONIBLE
    // ============================================

    /**
     * GET /productos/stock
     * @async
     * @param {Object} req - Solicitud HTTP
     * @param {Object} res - Respuesta HTTP
     * @returns {Array} Lista de productos con stock disponible
     * @description Obtiene productos que tienen cantidad mayor a 0
     */
    async obtenerConStock(req, res) {
        try {
            const productos = await productoRepository.getConStock();
            res.status(200).json(productos);
        } catch(error) {
            res.status(500).json({
                error: 'Error al obtener productos con stock',
                mensaje: error.message
            });
        }
    },

    // ============================================
    // CREAR NUEVO PRODUCTO
    // ============================================

    /**
     * POST /productos
     * @async
     * @param {Object} req - Solicitud HTTP
     * @param {string} req.body.nombre - Nombre del producto
     * @param {number} req.body.precio - Precio del producto
     * @param {number} req.body.cantidad - Cantidad disponible
     * @param {Object} res - Respuesta HTTP
     * @returns {Object} Producto creado
     * @description Crea un nuevo producto en el petshop
     */
    async crear(req, res) {
        try {
            const { nombre, precio, cantidad } = req.body;

            // PROGRAMACIÓN DEFENSIVA: Validaciones
            console.assert(nombre && nombre.trim(), 'Nombre del producto es requerido');
            console.assert(precio && precio > 0, 'Precio debe ser mayor a 0');
            console.assert(cantidad >= 0, 'Cantidad no puede ser negativa');

            if (!nombre || !precio || cantidad === undefined) {
                return res.status(400).json({
                    error: 'Datos incompletos',
                    mensaje: 'Se requieren: nombre, precio, cantidad'
                });
            }

            const nuevoProducto = await productoRepository.create({
                nombre: nombre.trim(),
                precio: parseFloat(precio),
                cantidad: parseInt(cantidad)
            });

            res.status(201).json({
                mensaje: 'Producto creado exitosamente',
                producto: nuevoProducto
            });
        } catch(error) {
            res.status(500).json({
                error: 'Error al crear el producto',
                mensaje: error.message
            });
        }
    },

    // ============================================
    // ACTUALIZAR PRODUCTO
    // ============================================

    /**
     * PUT /productos/:id
     * @async
     * @param {Object} req - Solicitud HTTP
     * @param {Object} res - Respuesta HTTP
     * @returns {Object} Producto actualizado
     * @description Actualiza un producto existente
     */
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { nombre, precio, cantidad } = req.body;

            const datosActualizar = {};
            if (nombre) datosActualizar.nombre = nombre;
            if (precio) datosActualizar.precio = parseFloat(precio);
            if (cantidad !== undefined) datosActualizar.cantidad = parseInt(cantidad);

            const resultado = await productoRepository.update(id, datosActualizar);
            
            res.status(200).json(resultado);
        } catch(error) {
            if (error.message === 'Registro no encontrado') {
                return res.status(404).json({
                    error: 'Producto no encontrado'
                });
            }
            res.status(500).json({
                error: 'Error al actualizar el producto',
                mensaje: error.message
            });
        }
    },

    // ============================================
    // ELIMINAR PRODUCTO
    // ============================================

    /**
     * DELETE /productos/:id
     * @async
     * @param {Object} req - Solicitud HTTP
     * @param {Object} res - Respuesta HTTP
     * @returns {void}
     * @description Elimina un producto del sistema
     */
    async eliminar(req, res) {
        try {
            const { id } = req.params;
            
            await productoRepository.delete(id);
            res.status(204).send();
        } catch(error) {
            if (error.message === 'Registro no encontrado') {
                return res.status(404).json({
                    error: 'Producto no encontrado'
                });
            }
            res.status(500).json({
                error: 'Error al eliminar el producto',
                mensaje: error.message
            });
        }
    }
};

module.exports = productoController;