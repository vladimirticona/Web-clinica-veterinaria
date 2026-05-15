const IUsuarioRepository = require('../../domain/ports/IUsuarioRepository');
const Usuario = require('../../domain/entities/Usuario');
const database = require('../config/database');

class MySQLUsuarioRepository extends IUsuarioRepository {
  async crear(usuario) {
    const query = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
    const values = [usuario.nombre, usuario.email, usuario.password, usuario.rol];
    const [result] = await database.execute(query, values);
    return { id: result.insertId, ...usuario };
  }

  async obtenerPorId(id) {
    const query = 'SELECT id, nombre, email, password, rol FROM usuarios WHERE id = ?';
    const [rows] = await database.execute(query, [id]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return new Usuario(row.id, row.nombre, row.email, row.password, row.rol);
  }

  async obtenerPorEmail(email) {
    const query = 'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?';
    const [rows] = await database.execute(query, [email]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return new Usuario(row.id, row.nombre, row.email, row.password, row.rol);
  }

  async obtenerTodos() {
    const query = 'SELECT id, nombre, email, password, rol FROM usuarios';
    const [rows] = await database.execute(query);
    return rows.map(row => new Usuario(row.id, row.nombre, row.email, row.password, row.rol));
  }

  async actualizar(id, usuario) {
    const query = 'UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ?';
    const values = [usuario.nombre, usuario.email, usuario.password, usuario.rol, id];
    await database.execute(query, values);
    return { id, ...usuario };
  }

  async eliminar(id) {
    const query = 'DELETE FROM usuarios WHERE id = ?';
    await database.execute(query, [id]);
    return true;
  }
}

module.exports = MySQLUsuarioRepository;