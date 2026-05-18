/*
  Base de datos deshabilitada.
  Se mantiene este archivo solo como referencia, pero el backend ahora usa repositorios en memoria.
  Si se quiere volver a habilitar MySQL, reactivar la conexión aquí y usar los repositorios MySQL correspondientes.
*/

const db = null;

/*
db.connect(err => {
  if (err) {
    console.error('Error de conexion: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos');
});
*/

module.exports = db;