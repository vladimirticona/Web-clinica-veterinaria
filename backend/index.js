/**
 * @fileoverview API RESTful para la gestión de pacientes en clínica veterinaria
 * con autenticación JWT por email y documentación Swagger
 * 
 * @author dev.ticma
 * @version 3.0.0
 * @since 2024-11-25
 * 
 * @description
 * Servidor Express que proporciona:
 * - Autenticación y registro de usuarios por email
 * - Gestión CRUD de pacientes y dueños
 * - Protección de endpoints con JWT
 * - Documentación automática con Swagger
 * 
 * @requires express
 * @requires mysql
 * @requires cors
 * @requires bcryptjs
 * @requires jsonwebtoken
 * @requires swagger-ui-express
 * @requires swagger-jsdoc
 */

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Clave secreta para firmar tokens JWT
 * @const {string} JWT_SECRET
 * @description En producción, cambiar por una clave aleatoria y segura
 */
const JWT_SECRET = 'tu_clave_secreta_super_segura_2024';

// ============================================
// CONEXIÓN A BASE DE DATOS
// ============================================

/**
 * Configuración de conexión a MySQL
 * @type {object}
 */
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_pruebas'
});

/**
 * Conectar a la base de datos
 * @function
 */
db.connect(err => {
    if(err){
        console.error('Error de conexion: ' + err.stack);
        return;
    }
    console.log('✓ Conectado a la base de datos');
});

// ============================================
// GENÉRICOS - REPOSITORIO GENÉRICO <T>
// ============================================

/**
 * @class GenericRepository
 * @description Clase genérica que proporciona operaciones CRUD reutilizables
 * para cualquier tabla de la base de datos
 * 
 * @example
 * const usuarioRepository = new GenericRepository('usuarios');
 * const usuarios = await usuarioRepository.getAll();
 */
class GenericRepository {
    /**
     * Constructor del repositorio
     * @param {string} tableName - Nombre de la tabla en la base de datos
     */
    constructor(tableName) {
        this.tableName = tableName;
    }

    /**
     * Obtiene todos los registros de la tabla
     * @async
     * @returns {Promise<Array>} Array con todos los registros
     * @throws {Error} Si hay error en la base de datos
     */
    getAll() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ${this.tableName}`;
            db.query(query, (err, results) => {
                if(err) reject(err);
                else resolve(results);
            });
        });
    }

    /**
     * Obtiene un registro por su ID
     * @async
     * @param {number} id - ID del registro a buscar
     * @returns {Promise<Object>} El registro encontrado
     * @throws {Error} Si hay error en la base de datos
     */
    getById(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
            db.query(query, [id], (err, results) => {
                if(err) reject(err);
                else resolve(results[0]);
            });
        });
    }

    /**
     * Crea un nuevo registro en la tabla
     * @async
     * @param {Object} data - Datos del nuevo registro
     * @returns {Promise<Object>} El registro creado con su ID
     * @throws {Error} Si hay error en la base de datos
     */
    create(data) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO ${this.tableName} SET ?`;
            db.query(query, data, (err, results) => {
                if(err) reject(err);
                else resolve({ id: results.insertId, ...data });
            });
        });
    }

    /**
     * Actualiza un registro existente
     * @async
     * @param {number} id - ID del registro a actualizar
     * @param {Object} data - Nuevos datos del registro
     * @returns {Promise<Object>} El registro actualizado
     * @throws {Error} Si el registro no existe o hay error en BD
     */
    update(id, data) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE ${this.tableName} SET ? WHERE id = ?`;
            db.query(query, [data, id], (err, results) => {
                if(err) reject(err);
                else if(results.affectedRows === 0) reject(new Error('Registro no encontrado'));
                else resolve({ id, ...data });
            });
        });
    }

    /**
     * Elimina un registro de la tabla
     * @async
     * @param {number} id - ID del registro a eliminar
     * @returns {Promise<Object>} Objeto con success: true
     * @throws {Error} Si el registro no existe o hay error en BD
     */
    delete(id) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
            db.query(query, [id], (err, results) => {
                if(err) reject(err);
                else if(results.affectedRows === 0) reject(new Error('Registro no encontrado'));
                else resolve({ success: true });
            });
        });
    }
}

// Instancias de repositorios
const mascotaRepository = new GenericRepository('mascotas');
const dueñoRepository = new GenericRepository('dueños');
const usuarioRepository = new GenericRepository('usuarios');

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
 * @description Verifica que el token sea válido y no haya expirado
 * 
 * @example
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

// ============================================
// CONFIGURACIÓN SWAGGER
// ============================================

/**
 * Configuración de OpenAPI/Swagger para documentación automática
 * @type {Object}
 */
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Clínica Veterinaria',
            version: '3.0.0',
            description: 'API RESTful para gestión de mascotas y dueños con autenticación JWT por email'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Usuario: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        nombre_completo: { type: 'string' },
                        email: { type: 'string' },
                        rol: { type: 'string' }
                    }
                },
                Mascota: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        nombre: { type: 'string' },
                        especie: { type: 'string' },
                        edad: { type: 'integer' },
                        sexo: { type: 'string', enum: ['Macho', 'Hembra'] },
                        id_dueño: { type: 'integer' }
                    }
                },
                Dueño: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        nombre_completo: { type: 'string' },
                        telefono: { type: 'string' },
                        email: { type: 'string' }
                    }
                }
            }
        }
    },
    apis: ['./index.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================================
// ENDPOINTS DE AUTENTICACIÓN
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
app.post('/auth/registro', async (req, res) => {
    try {
        const { nombre_completo, email, contraseña } = req.body;

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
});

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
app.post('/auth/login', async (req, res) => {
    try {
        const { email, contraseña } = req.body;

        if (!email || !contraseña) {
            return res.status(400).json({
                error: 'Credenciales incompletas'
            });
        }

        // Buscar usuario por email
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        db.query(query, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error en el servidor'
                });
            }

            if (results.length === 0) {
                return res.status(400).json({
                    error: 'Credenciales inválidas'
                });
            }

            const usuario = results[0];

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
        });
    } catch(error) {
        res.status(500).json({
            error: 'Error al iniciar sesión',
            mensaje: error.message
        });
    }
});

// ============================================
// ENDPOINTS DE MASCOTAS (PROTEGIDOS)
// ============================================

/**
 * @swagger
 * /mascotas:
 *   get:
 *     summary: Obtener todas las mascotas con información de dueños
 *     tags:
 *       - Mascotas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mascotas con dueños
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * GET /mascotas
 * @async
 * @param {Object} req - Solicitud HTTP (requiere token en Authorization)
 * @param {Object} res - Respuesta HTTP
 * @returns {Array} Lista de todas las mascotas con información de dueños
 * @description Obtiene la lista completa de mascotas con información de dueños (requiere autenticación)
 */
app.get('/mascotas', verificarToken, async (req, res) => {
    try {
        const query = `
            SELECT m.*, d.nombre_completo as nombre_dueño, d.telefono, d.email as email_dueño
            FROM mascotas m
            LEFT JOIN dueños d ON m.id_dueño = d.id
            ORDER BY m.fecha_creacion DESC
        `;
        
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error al obtener las mascotas',
                    mensaje: err.message
                });
            }
            res.status(200).json(results);
        });
    } catch(error) {
        res.status(500).json({
            error: 'Error al obtener las mascotas',
            mensaje: error.message
        });
    }
});

/**
 * @swagger
 * /mascotas/{id}:
 *   get:
 *     summary: Obtener mascota por ID
 *     tags:
 *       - Mascotas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mascota encontrada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Mascota no encontrada
 */

/**
 * GET /mascotas/:id
 * @async
 * @param {Object} req - Solicitud HTTP con ID en params
 * @param {Object} res - Respuesta HTTP
 * @returns {Object} La mascota solicitada con información del dueño
 * @description Obtiene una mascota específica por su ID
 */
app.get('/mascotas/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT m.*, d.nombre_completo as nombre_dueño, d.telefono, d.email as email_dueño
            FROM mascotas m
            LEFT JOIN dueños d ON m.id_dueño = d.id
            WHERE m.id = ?
        `;
        
        db.query(query, [id], (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error al obtener la mascota',
                    mensaje: err.message
                });
            }
            
            if (results.length === 0) {
                return res.status(404).json({
                    error: 'Mascota no encontrada'
                });
            }
            
            res.status(200).json(results[0]);
        });
    } catch(error) {
        res.status(500).json({
            error: 'Error al obtener la mascota',
            mensaje: error.message
        });
    }
});

/**
 * @swagger
 * /mascotas/add:
 *   post:
 *     summary: Crear nueva mascota y dueño
 *     tags:
 *       - Mascotas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['nombre', 'especie', 'edad', 'sexo', 'nombre_dueño', 'telefono', 'email']
 *             properties:
 *               nombre:
 *                 type: string
 *               especie:
 *                 type: string
 *               edad:
 *                 type: integer
 *               sexo:
 *                 type: string
 *                 enum: ['Macho', 'Hembra']
 *               nombre_dueño:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mascota y dueño creados exitosamente
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: No autorizado
 */

/**
 * POST /mascotas/add
 * @async
 * @param {Object} req - Solicitud HTTP con datos de mascota y dueño
 * @param {string} req.body.nombre - Nombre de la mascota
 * @param {string} req.body.especie - Especie de la mascota (convertida a minúsculas)
 * @param {number} req.body.edad - Edad de la mascota
 * @param {string} req.body.sexo - Sexo de la mascota (Macho/Hembra)
 * @param {string} req.body.nombre_dueño - Nombre del dueño
 * @param {string} req.body.telefono - Teléfono del dueño
 * @param {string} req.body.email - Email del dueño
 * @param {Object} res - Respuesta HTTP
 * @returns {Object} Mascota y dueño creados
 * @description Crea un nuevo dueño y mascota en el sistema
 */
app.post('/mascotas/add', verificarToken, async (req, res) => {
    try {
        const { nombre, especie, edad, sexo, nombre_dueño, telefono, email } = req.body;
        
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

        // Crear mascota con el ID del dueño
        const nuevaMascota = await mascotaRepository.create({
            nombre,
            especie: especie.toLowerCase(), // Convertir a minúsculas para consistencia
            edad,
            sexo,
            id_dueño: nuevoDueño.id
        });

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
});

/**
 * @swagger
 * /mascotas/update/{id}:
 *   put:
 *     summary: Actualizar mascota
 *     tags:
 *       - Mascotas
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
 *               especie:
 *                 type: string
 *               edad:
 *                 type: integer
 *               sexo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mascota actualizada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Mascota no encontrada
 */

/**
 * PUT /mascotas/update/:id
 * @async
 * @param {Object} req - Solicitud HTTP con datos actualizados
 * @param {Object} res - Respuesta HTTP
 * @returns {Object} Mascota actualizada
 * @description Actualiza los datos de una mascota existente
 */
app.put('/mascotas/update/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, especie, edad, sexo } = req.body;

        const datosActualizar = {};
        if (nombre) datosActualizar.nombre = nombre;
        if (especie) datosActualizar.especie = especie.toLowerCase();
        if (edad) datosActualizar.edad = edad;
        if (sexo) datosActualizar.sexo = sexo;

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
});

/**
 * @swagger
 * /mascotas/delete/{id}:
 *   delete:
 *     summary: Eliminar mascota
 *     tags:
 *       - Mascotas
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
 *         description: Mascota eliminada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Mascota no encontrada
 */

/**
 * DELETE /mascotas/delete/:id
 * @async
 * @param {Object} req - Solicitud HTTP con ID en params
 * @param {Object} res - Respuesta HTTP
 * @returns {void}
 * @description Elimina una mascota del sistema
 */
app.delete('/mascotas/delete/:id', verificarToken, async (req, res) => {
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
});

// ============================================
// ENDPOINTS DE REPORTES
// ============================================

/**
 * @swagger
 * /reportes/estadisticas:
 *   get:
 *     summary: Obtener estadísticas completas
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *       401:
 *         description: No autorizado
 */

/**
 * GET /reportes/estadisticas
 * @async
 * @param {Object} req - Solicitud HTTP
 * @param {Object} res - Respuesta HTTP
 * @returns {Object} Estadísticas completas del sistema
 * @description Obtiene estadísticas detalladas para reportes
 */
app.get('/reportes/estadisticas', verificarToken, async (req, res) => {
    try {
        const queries = {
            totalMascotas: 'SELECT COUNT(*) as total FROM mascotas',
            totalDueños: 'SELECT COUNT(*) as total FROM dueños',
            mascotasEsteMes: `
                SELECT COUNT(*) as total FROM mascotas 
                WHERE MONTH(fecha_creacion) = MONTH(CURRENT_DATE()) 
                AND YEAR(fecha_creacion) = YEAR(CURRENT_DATE())
            `,
            especiesComunes: `
                SELECT especie, COUNT(*) as cantidad 
                FROM mascotas 
                GROUP BY LOWER(especie) 
                ORDER BY cantidad DESC 
                LIMIT 10
            `,
            distribucionSexo: `
                SELECT sexo, COUNT(*) as cantidad 
                FROM mascotas 
                WHERE sexo IS NOT NULL 
                GROUP BY sexo
            `,
            distribucionEdad: `
                SELECT 
                    CASE 
                        WHEN edad <= 1 THEN 'Cachorro (0-1 año)'
                        WHEN edad <= 3 THEN 'Joven (1-3 años)'
                        WHEN edad <= 7 THEN 'Adulto (3-7 años)'
                        ELSE 'Senior (7+ años)'
                    END as grupo_edad,
                    COUNT(*) as cantidad
                FROM mascotas 
                WHERE edad IS NOT NULL
                GROUP BY grupo_edad
                ORDER BY MIN(edad)
            `,
            mascotasPorMes: `
                SELECT 
                    DATE_FORMAT(fecha_creacion, '%Y-%m') as mes,
                    COUNT(*) as cantidad
                FROM mascotas 
                WHERE fecha_creacion >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
                GROUP BY mes
                ORDER BY mes
            `
        };

        const resultados = {};

        for (const [key, query] of Object.entries(queries)) {
            await new Promise((resolve, reject) => {
                db.query(query, (err, results) => {
                    if (err) reject(err);
                    else {
                        resultados[key] = results;
                        resolve();
                    }
                });
            });
        }

        res.status(200).json(resultados);
    } catch(error) {
        res.status(500).json({
            error: 'Error al obtener estadísticas',
            mensaje: error.message
        });
    }
});

// ============================================
// ENDPOINTS DE PERFIL (PROTEGIDOS)
// ============================================

/**
 * @swagger
 * /perfil/actualizar:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags:
 *       - Perfil
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_completo:
 *                 type: string
 *               email:
 *                 type: string
 *               contraseña_actual:
 *                 type: string
 *               contraseña_nueva:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *       400:
 *         description: Datos inválidos o contraseña incorrecta
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */

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
app.put('/perfil/actualizar', verificarToken, async (req, res) => {
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
});

// ============================================
// INICIAR SERVIDOR
// ============================================

/**
 * Puerto del servidor
 * @const {number} PORT
 */
const PORT = process.env.PORT || 3000;

/**
 * Iniciar servidor
 */
app.listen(PORT, () => {
    console.log(`✓ Servidor corriendo en puerto ${PORT}`);
    console.log(`✓ Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});