/**
 * @fileoverview API RESTful para la gestión de pacientes en clínica veterinaria
 * con autenticación JWT por email y documentación Swagger
 * 
 * @author dev.ticma
 * @version 2.0.0
 * @since 2024-11-25
 * 
 * @description
 * Servidor Express que proporciona:
 * - Autenticación y registro de usuarios por email
 * - Gestión CRUD de pacientes
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
const pacienteRepository = new GenericRepository('pacientes');
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
            version: '2.0.0',
            description: 'API RESTful para gestión de pacientes con autenticación JWT por email'
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
                Paciente: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        nombre_mascota: { type: 'string' },
                        raza: { type: 'string' },
                        nombre_dueño: { type: 'string' }
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
// ENDPOINTS DE PACIENTES (PROTEGIDOS)
// ============================================

/**
 * @swagger
 * /pacientes:
 *   get:
 *     summary: Obtener todos los pacientes
 *     tags:
 *       - Pacientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * GET /pacientes
 * @async
 * @param {Object} req - Solicitud HTTP (requiere token en Authorization)
 * @param {Object} res - Respuesta HTTP
 * @returns {Array} Lista de todos los pacientes
 * @description Obtiene la lista completa de pacientes (requiere autenticación)
 */
app.get('/pacientes', verificarToken, async (req, res) => {
    try {
        const pacientes = await pacienteRepository.getAll();
        res.status(200).json(pacientes);
    } catch(error) {
        res.status(500).json({
            error: 'Error al obtener los pacientes',
            mensaje: error.message
        });
    }
});

/**
 * @swagger
 * /pacientes/{id}:
 *   get:
 *     summary: Obtener paciente por ID
 *     tags:
 *       - Pacientes
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
 *         description: Paciente encontrado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Paciente no encontrado
 */

/**
 * GET /pacientes/:id
 * @async
 * @param {Object} req - Solicitud HTTP con ID en params
 * @param {Object} res - Respuesta HTTP
 * @returns {Object} El paciente solicitado
 * @description Obtiene un paciente específico por su ID
 */
app.get('/pacientes/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await pacienteRepository.getById(id);
        
        if (!paciente) {
            return res.status(404).json({
                error: 'Paciente no encontrado'
            });
        }
        
        res.status(200).json(paciente);
    } catch(error) {
        res.status(500).json({
            error: 'Error al obtener el paciente',
            mensaje: error.message
        });
    }
});

/**
 * @swagger
 * /pacientes/add:
 *   post:
 *     summary: Crear nuevo paciente
 *     tags:
 *       - Pacientes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['nombre_mascota', 'raza', 'nombre_dueño']
 *             properties:
 *               nombre_mascota:
 *                 type: string
 *               raza:
 *                 type: string
 *               nombre_dueño:
 *                 type: string
 *     responses:
 *       201:
 *         description: Paciente creado exitosamente
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: No autorizado
 */

/**
 * POST /pacientes/add
 * @async
 * @param {Object} req - Solicitud HTTP con datos del paciente
 * @param {string} req.body.nombre_mascota - Nombre de la mascota
 * @param {string} req.body.raza - Raza de la mascota
 * @param {string} req.body.nombre_dueño - Nombre del propietario
 * @param {Object} res - Respuesta HTTP
 * @returns {Object} Paciente creado con su ID
 * @description Crea un nuevo paciente en el sistema
 */
app.post('/pacientes/add', verificarToken, async (req, res) => {
    try {
        const { nombre_mascota, raza, nombre_dueño } = req.body;
        
        if (!nombre_mascota || !raza || !nombre_dueño) {
            return res.status(400).json({
                error: 'Datos incompletos'
            });
        }

        const resultado = await pacienteRepository.create({
            nombre_mascota,
            raza,
            nombre_dueño
        });
        
        res.status(201).json(resultado);
    } catch(error) {
        res.status(500).json({
            error: 'Error al crear el paciente',
            mensaje: error.message
        });
    }
});

/**
 * @swagger
 * /pacientes/update/{id}:
 *   put:
 *     summary: Actualizar paciente
 *     tags:
 *       - Pacientes
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
 *               nombre_mascota:
 *                 type: string
 *               raza:
 *                 type: string
 *               nombre_dueño:
 *                 type: string
 *     responses:
 *       200:
 *         description: Paciente actualizado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Paciente no encontrado
 */

/**
 * PUT /pacientes/update/:id
 * @async
 * @param {Object} req - Solicitud HTTP con datos actualizados
 * @param {Object} res - Respuesta HTTP
 * @returns {Object} Paciente actualizado
 * @description Actualiza los datos de un paciente existente
 */
app.put('/pacientes/update/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_mascota, raza, nombre_dueño } = req.body;

        const resultado = await pacienteRepository.update(id, {
            nombre_mascota,
            raza,
            nombre_dueño
        });
        
        res.status(200).json(resultado);
    } catch(error) {
        if (error.message === 'Registro no encontrado') {
            return res.status(404).json({
                error: 'Paciente no encontrado'
            });
        }
        res.status(500).json({
            error: 'Error al actualizar el paciente',
            mensaje: error.message
        });
    }
});

/**
 * @swagger
 * /pacientes/delete/{id}:
 *   delete:
 *     summary: Eliminar paciente
 *     tags:
 *       - Pacientes
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
 *         description: Paciente eliminado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Paciente no encontrado
 */

/**
 * DELETE /pacientes/delete/:id
 * @async
 * @param {Object} req - Solicitud HTTP con ID en params
 * @param {Object} res - Respuesta HTTP
 * @returns {void}
 * @description Elimina un paciente del sistema
 */
app.delete('/pacientes/delete/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        await pacienteRepository.delete(id);
        res.status(204).send();
    } catch(error) {
        if (error.message === 'Registro no encontrado') {
            return res.status(404).json({
                error: 'Paciente no encontrado'
            });
        }
        res.status(500).json({
            error: 'Error al eliminar el paciente',
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