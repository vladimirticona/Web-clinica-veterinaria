const db = require('../config/database');

class MySQLDueñoRepository {
  create(datos) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO dueños SET ?', datos, (err, results) => {
        if (err) reject(err);
        else resolve({ id: results.insertId, ...datos });
      });
    });
  }

  getById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM dueños WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }
}

module.exports = MySQLDueñoRepository;