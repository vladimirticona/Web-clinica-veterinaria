const IReservacionRepository = require('../../domain/ports/IReservacionRepository');
const db = require('../config/database');

class MySQLReservacionRepository extends IReservacionRepository {
  getAllConProductos() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, p.nombre as nombre_producto, p.precio as precio_producto
        FROM reservaciones r
        LEFT JOIN productos p ON r.producto_adicional_id = p.id
        ORDER BY r.fecha_solicitada DESC, r.hora_solicitada DESC
      `;
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  getById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM reservaciones WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  create(datos) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO reservaciones SET ?', datos, (err, results) => {
        if (err) reject(err);
        else resolve({ id: results.insertId, ...datos });
      });
    });
  }

  update(id, datos) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE reservaciones SET ? WHERE id = ?', [datos, id], (err, results) => {
        if (err) reject(err);
        else if (results.affectedRows === 0) reject(new Error('Registro no encontrado'));
        else resolve({ id, ...datos });
      });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM reservaciones WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else if (results.affectedRows === 0) reject(new Error('Registro no encontrado'));
        else resolve({ success: true });
      });
    });
  }
}

module.exports = MySQLReservacionRepository;