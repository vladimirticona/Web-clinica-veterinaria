/**
 * @class GenericRepository
 * @descripcion Clase genérica que proporciona operaciones CRUD reutilizables
 * para cualquier tabla de la base de datos
 * 
 * @ejemplo
 * const usuarioRepository = new GenericRepository('usuarios');
 * const usuarios = await usuarioRepository.getAll();
 */
class GenericRepository {
    /**
     * Constructor del repositorio
     * @param {string} tableName - Nombre de la tabla en la base de datos
     * @param {Object} db - Conexión a la base de datos MySQL
     */
    constructor(tableName, db) {
        this.tableName = tableName;
        this.db = db;
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
            this.db.query(query, (err, results) => {
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
            this.db.query(query, [id], (err, results) => {
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
            this.db.query(query, data, (err, results) => {
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
            this.db.query(query, [data, id], (err, results) => {
                if(err) reject(err);
                // PROGRAMACIÓN DEFENSIVA: Validar que el registro existe antes de retornar
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
            this.db.query(query, [id], (err, results) => {
                if(err) reject(err);
                // PROGRAMACIÓN DEFENSIVA: Verificar que se eliminó algún registro
                else if(results.affectedRows === 0) reject(new Error('Registro no encontrado'));
                else resolve({ success: true });
            });
        });
    }
}

module.exports = GenericRepository;