class AuthController {
  constructor(authService) {
    this.authService = authService;
    this.registro = this.registro.bind(this);
    this.login = this.login.bind(this);
  }

  async registro(req, res) {
    try {
      const resultado = await this.authService.registro(req.body);
      res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario: resultado });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, contraseña } = req.body;
      const resultado = await this.authService.login(email, contraseña);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = AuthController;