/**
 * @fileoverview API RESTful para la gestión de pacientes en clínica veterinaria
 * con autenticación JWT por email y documentación Swagger
 * 
 * @description
 * Servidor Express que proporciona:
 * - Autenticación y registro de usuarios por email
 * - Gestión CRUD de pacientes y dueños
 * - Protección de endpoints con JWT
 * - Documentación automática con Swagger
 * 
 * @requires express
 * @requires cors
 * @requires swagger-ui-express
 * @requires swagger-jsdoc
 */

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = require('./src/config/swaggerConfig');
const { PORT } = require('./src/utils/constants');

// ============================================
// IMPORTACIÓN DE RUTAS
// ============================================

// Importar rutas
const authRoutes = require('./src/routes/authRoutes');
const mascotaRoutes = require('./src/routes/mascotaRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const reservacionRoutes = require('./src/routes/reservacionRoutes');
const reporteRoutes = require('./src/routes/reporteRoutes');
const perfilRoutes = require('./src/routes/perfilRoutes');

// Importar conexión a BD (esto inicia la conexión automáticamente)
require('./src/config/database');

const app = express();

// ============================================
// CONFIGURACIÓN DE MIDDLEWARES
// ============================================

app.use(cors());
app.use(express.json());

// ============================================
// CONFIGURACIÓN SWAGGER
// ============================================

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================================
// DEFINICIÓN DE RUTAS
// ============================================

app.use('/auth', authRoutes);
app.use('/mascotas', mascotaRoutes);
app.use('/productos', productoRoutes);
app.use('/reservaciones', reservacionRoutes);
app.use('/reportes', reporteRoutes);
app.use('/perfil', perfilRoutes);

// ============================================
// RUTA DE PRUEBA
// ============================================

/**
 * Ruta raíz para verificar que el servidor está funcionando
 * @route GET /
 * @returns {Object} Mensaje de estado
 */
app.get('/', (req, res) => {
    res.json({ 
        mensaje: 'API Clínica Veterinaria funcionando',
        version: '3.0.0',
        documentacion: '/api-docs'
    });
});

// ============================================
// MANEJO DE ERRORES 404
// ============================================

/**
 * Middleware para manejar rutas no encontradas
 */
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        mensaje: `La ruta ${req.method} ${req.url} no existe`
    });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

/**
 * Iniciar servidor
 */
app.listen(PORT, () => {
    console.log(`✓ Servidor corriendo en puerto ${PORT}`);
    console.log(`✓ Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});