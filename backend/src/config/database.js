/**
 * @fileoverview Configuración de conexión a la base de datos MySQL
 * @requires mysql
 */

const mysql = require('mysql');

// ============================================
// CONFIGURACIÓN DE CONEXIÓN A BASE DE DATOS
// ============================================

/**
 * Configuración de conexión a MySQL
 * @type {Object}
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

module.exports = db;