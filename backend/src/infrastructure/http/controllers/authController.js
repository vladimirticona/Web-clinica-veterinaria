class AuthController {
  constructor(authService) {
    this.authService = authService;
    this.login = this.login.bind(this);
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
}

module.exports = AuthController;