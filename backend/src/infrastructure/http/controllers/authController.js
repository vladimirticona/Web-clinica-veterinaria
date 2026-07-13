const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'secret_key';

const registro = async (req, res) => {
  try {
    const { nombre_completo, email, contraseña } = req.body;
    if (!nombre_completo || !email || !contraseña) {
      return res.status(400).json({ error: 'Datos incompletos o email ya existe' });
    }
    const hash = await bcrypt.hash(contraseña, 10);
    db.query(
      'INSERT INTO usuarios (nombre_completo, email, contraseña) VALUES (?, ?, ?)',
      [nombre_completo, email, hash],
      (err, result) => {
        if (err) return res.status(400).json({ error: 'Datos incompletos o email ya existe' });
        res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      const usuario = results[0];
      const valido = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' });
      const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, SECRET, { expiresIn: '24h' });
      res.json({ token, usuario: { id: usuario.id, nombre_completo: usuario.nombre_completo, email: usuario.email, rol: usuario.rol } });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { registro, login };