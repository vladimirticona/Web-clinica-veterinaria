class AuthController {
  constructor(authService) {
    this.authService = authService;
    this.login = this.login.bind(this);
    this.registro = this.registro.bind(this);
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const resultado = await this.authService.login(email, password);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async registro(req, res) {
    try {
      const { nombre, nombre_completo, email, password } = req.body;
      const usuario = await this.authService.crearUsuario({
        nombre: nombre || nombre_completo,
        email,
        password
      });
      res.status(201).json({ message: 'Usuario registrado', usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = AuthController;