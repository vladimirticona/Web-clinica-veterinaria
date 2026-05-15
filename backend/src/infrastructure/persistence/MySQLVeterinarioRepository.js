const IVeterinarioRepository = require('../../domain/ports/IVeterinarioRepository');
const Veterinario = require('../../domain/entities/Veterinario');
const database = require('../config/database');

class MySQLVeterinarioRepository extends IVeterinarioRepository {
  async crear(veterinario) {
    const query = 'INSERT INTO veterinarios (nombre, especialidad, telefono, email, licencia) VALUES (?, ?, ?, ?, ?)';
    const values = [veterinario.nombre, veterinario.especialidad, veterinario.telefono, veterinario.email, veterinario.licencia];
    const [result] = await database.execute(query, values);
    return { id: result.insertId, ...veterinario };
  }

  async obtenerPorId(id) {
    const query = 'SELECT id, nombre, especialidad, telefono, email, licencia FROM veterinarios WHERE id = ?';
    const [rows] = await database.execute(query, [id]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return new Veterinario(row.id, row.nombre, row.especialidad, row.telefono, row.email, row.licencia);
  }

  async obtenerPorEspecialidad(especialidad) {
    const query = 'SELECT id, nombre, especialidad, telefono, email, licencia FROM veterinarios WHERE especialidad = ?';
    const [rows] = await database.execute(query, [especialidad]);
    return rows.map(row => new Veterinario(row.id, row.nombre, row.especialidad, row.telefono, row.email, row.licencia));
  }

  async obtenerTodos() {
    const query = 'SELECT id, nombre, especialidad, telefono, email, licencia FROM veterinarios';
    const [rows] = await database.execute(query);
    return rows.map(row => new Veterinario(row.id, row.nombre, row.especialidad, row.telefono, row.email, row.licencia));
  }

  async actualizar(id, veterinario) {
    const query = 'UPDATE veterinarios SET nombre = ?, especialidad = ?, telefono = ?, email = ?, licencia = ? WHERE id = ?';
    const values = [veterinario.nombre, veterinario.especialidad, veterinario.telefono, veterinario.email, veterinario.licencia, id];
    await database.execute(query, values);
    return { id, ...veterinario };
  }

  async eliminar(id) {
    const query = 'DELETE FROM veterinarios WHERE id = ?';
    await database.execute(query, [id]);
    return true;
  }
}

module.exports = MySQLVeterinarioRepository;