const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'db_pruebas'
});

db.connect(err => {
  if (err) {
    console.error('Error de conexion: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Add promise-based execute helper to support repository methods
db.execute = function (query, params = []) {
  return new Promise((resolve, reject) => {
    this.query(query, params, (err, results, fields) => {
      if (err) {
        reject(err);
        return;
      }
      resolve([results, fields]);
    });
  });
};

module.exports = db;