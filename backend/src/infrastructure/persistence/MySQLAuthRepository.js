const IAuthRepository = require('../../domain/ports/IAuthRepository');
const db = require('../config/database');

class MySQLAuthRepository extends IAuthRepository {
  findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  create(datos) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO usuarios SET ?', datos, (err, results) => {
        if (err) reject(err);
        else resolve({ id: results.insertId, ...datos });
      });
    });
  }
}

module.exports = MySQLAuthRepository;