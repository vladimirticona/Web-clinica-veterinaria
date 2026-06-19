const IProductoRepository = require('../../domain/ports/IProductoRepository');
const db = require('../config/database');

class MySQLProductoRepository extends IProductoRepository {
  getAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM productos', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  getById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM productos WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  create(datos) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO productos SET ?', datos, (err, results) => {
        if (err) reject(err);
        else resolve({ id: results.insertId, ...datos });
      });
    });
  }

  update(id, datos) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE productos SET ? WHERE id = ?', [datos, id], (err, results) => {
        if (err) reject(err);
        else if (results.affectedRows === 0) reject(new Error('Registro no encontrado'));
        else resolve({ id, ...datos });
      });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM productos WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else if (results.affectedRows === 0) reject(new Error('Registro no encontrado'));
        else resolve({ success: true });
      });
    });
  }
}

module.exports = MySQLProductoRepository;