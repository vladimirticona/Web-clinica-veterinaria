const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// CONEXIÓN A BASE DE DATOS
// ============================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_pruebas'
});

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
class GenericRepository {
    constructor(tableName) {
        this.tableName = tableName;
    }

    // Obtener todos los registros
    getAll() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ${this.tableName}`;
            db.query(query, (err, results) => {
                if(err) reject(err);
                else resolve(results);
            });
        });
    }

    // Obtener por ID
    getById(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
            db.query(query, [id], (err, results) => {
                if(err) reject(err);
                else resolve(results[0]);
            });
        });
    }

    // Crear registro
    create(data) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO ${this.tableName} SET ?`;
            db.query(query, data, (err, results) => {
                if(err) reject(err);
                else resolve({ id: results.insertId, ...data });
            });
        });
    }

    // Actualizar registro
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

    // Eliminar registro
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

// Instancia del repositorio para pacientes
const pacienteRepository = new GenericRepository('pacientes');

// ============================================
// CONFIGURACIÓN SWAGGER/OPENAPI
// ============================================
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Clínica Veterinaria',
            version: '1.0.0',
            description: 'API RESTful para gestión de pacientes en clínica veterinaria',
            contact: {
                name: 'Equipo de Desarrollo',
                email: 'desarrollo@clinicaveterinaria.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            schemas: {
                Paciente: {
                    type: 'object',
                    required: ['nombre_mascota', 'raza', 'nombre_dueño'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único del paciente'
                        },
                        nombre_mascota: {
                            type: 'string',
                            description: 'Nombre de la mascota'
                        },
                        raza: {
                            type: 'string',
                            description: 'Raza de la mascota'
                        },
                        nombre_dueño: {
                            type: 'string',
                            description: 'Nombre del propietario'
                        }
                    },
                    example: {
                        id: 1,
                        nombre_mascota: 'Max',
                        raza: 'Labrador',
                        nombre_dueño: 'Juan Pérez'
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
// ENDPOINTS CON DOCUMENTACIÓN SWAGGER
// ============================================

/**
 * @swagger
 * /pacientes:
 *   get:
 *     summary: Obtener todos los pacientes
 *     description: Retorna una lista completa de todos los pacientes registrados en la clínica
 *     tags:
 *       - Pacientes
 *     responses:
 *       200:
 *         description: Lista de pacientes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Paciente'
 *       500:
 *         description: Error al obtener los pacientes
 */
app.get('/pacientes', async (req, res) => {
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
 *     summary: Obtener un paciente por ID
 *     description: Retorna los detalles de un paciente específico
 *     tags:
 *       - Pacientes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Paciente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error al obtener el paciente
 */
app.get('/pacientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await pacienteRepository.getById(id);
        if(!paciente) {
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
 *     summary: Crear un nuevo paciente
 *     description: Registra un nuevo paciente en la clínica veterinaria
 *     tags:
 *       - Pacientes
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
 *                 example: 'Max'
 *               raza:
 *                 type: string
 *                 example: 'Labrador'
 *               nombre_dueño:
 *                 type: string
 *                 example: 'Juan Pérez'
 *     responses:
 *       201:
 *         description: Paciente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       400:
 *         description: Datos inválidos o incompletos
 *       500:
 *         description: Error al crear el paciente
 */
app.post('/pacientes/add', async (req, res) => {
    try {
        const { nombre_mascota, raza, nombre_dueño } = req.body;
        
        if(!nombre_mascota || !raza || !nombre_dueño) {
            return res.status(400).json({
                error: 'Datos incompletos',
                mensaje: 'Se requieren: nombre_mascota, raza, nombre_dueño'
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
 *     summary: Actualizar un paciente
 *     description: Actualiza los datos de un paciente existente
 *     tags:
 *       - Pacientes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del paciente
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
 *         description: Paciente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error al actualizar el paciente
 */
app.put('/pacientes/update/:id', async (req, res) => {
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
        if(error.message === 'Registro no encontrado') {
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
 *     summary: Eliminar un paciente
 *     description: Elimina un paciente de la base de datos
 *     tags:
 *       - Pacientes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del paciente
 *     responses:
 *       204:
 *         description: Paciente eliminado exitosamente
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error al eliminar el paciente
 */
app.delete('/pacientes/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pacienteRepository.delete(id);
        res.status(204).send();
    } catch(error) {
        if(error.message === 'Registro no encontrado') {
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✓ Servidor corriendo en puerto ${PORT}`);
    console.log(`✓ Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});