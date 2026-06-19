const express = require('express');
const router = express.Router();

module.exports = (productoController) => {
  router.get('/', productoController.obtenerTodos);
  router.post('/', productoController.crear);
  router.put('/:id', productoController.actualizar);
  router.delete('/:id', productoController.eliminar);
  return router;
};