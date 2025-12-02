/**
 * @fileoverview Configuración de OpenAPI/Swagger para documentación automática
 * @requires swagger-jsdoc
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
                        id_dueño: { type: 'integer' },
                        motivo: { type: 'string' },
                        producto_adicional_id: { type: 'integer' },
                        cantidad_producto: { type: 'integer' }
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
                },
                Producto: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        nombre: { type: 'string' },
                        precio: { type: 'number' },
                        cantidad: { type: 'integer' }
                    }
                },
                Reservacion: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        nombre_cliente: { type: 'string' },
                        telefono: { type: 'string' },
                        email: { type: 'string' },
                        nombre_mascota: { type: 'string' },
                        especie: { type: 'string' },
                        motivo_consulta: { type: 'string' },
                        fecha_solicitada: { type: 'string', format: 'date' },
                        hora_solicitada: { type: 'string', format: 'time' },
                        tipo_cita: { type: 'string', enum: ['presencial', 'domicilio'] },
                        estado: { type: 'string', enum: ['pendiente', 'confirmada', 'cancelada', 'reprogramar'] },
                        producto_adicional_id: { type: 'integer' },
                        cantidad_producto: { type: 'integer' }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js'] // Especificar dónde están las rutas con anotaciones Swagger
};

module.exports = swaggerOptions;