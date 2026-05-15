const express = require('express');
const router = express.Router();

module.exports = (veterinarioController) => {
  router.get('/', veterinarioController.obtenerTodos);
  router.get('/especialidad/:especialidad', veterinarioController.obtenerPorEspecialidad);
  router.get('/:id', veterinarioController.obtenerPorId);
  router.post('/', veterinarioController.crear);
  router.put('/:id', veterinarioController.actualizar);
  router.delete('/:id', veterinarioController.eliminar);
  return router;
};