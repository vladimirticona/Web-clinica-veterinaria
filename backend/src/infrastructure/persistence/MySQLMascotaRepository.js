const IMascotaRepository = require('../../domain/ports/IMascotaRepository');
const db = require('../config/database');

class MySQLMascotaRepository extends IMascotaRepository {
  getMascotasConDueños() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT m.*, d.nombre_completo as nombre_dueño, d.telefono, d.email as email_dueño,
               p.nombre as nombre_producto, p.precio as precio_producto
        FROM mascotas m
        LEFT JOIN dueños d ON m.id_dueño = d.id
        LEFT JOIN productos p ON m.producto_adicional_id = p.id
        ORDER BY m.fecha_creacion DESC
      `;
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  getMascotaConDueño(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT m.*, d.nombre_completo as nombre_dueño, d.telefono, d.email as email_dueño,
               p.nombre as nombre_producto, p.precio as precio_producto
        FROM mascotas m
        LEFT JOIN dueños d ON m.id_dueño = d.id
        LEFT JOIN productos p ON m.producto_adicional_id = p.id
        WHERE m.id = ?
      `;
      db.query(query, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  getById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM mascotas WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  create(datos) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO mascotas SET ?', datos, (err, results) => {
        if (err) reject(err);
        else resolve({ id: results.insertId, ...datos });
      });
    });
  }

  update(id, datos) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE mascotas SET ? WHERE id = ?', [datos, id], (err, results) => {
        if (err) reject(err);
        else if (results.affectedRows === 0) reject(new Error('Registro no encontrado'));
        else resolve({ id, ...datos });
      });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM mascotas WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else if (results.affectedRows === 0) reject(new Error('Registro no encontrado'));
        else resolve({ success: true });
      });
    });
  }
}

module.exports = MySQLMascotaRepository;