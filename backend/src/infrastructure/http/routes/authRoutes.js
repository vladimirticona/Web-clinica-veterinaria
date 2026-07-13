const express = require('express');
const router = express.Router();

module.exports = (authController) => {
  router.post('/registro', authController.registro.bind(authController));
  router.post('/login', authController.login.bind(authController));
  return router;
};