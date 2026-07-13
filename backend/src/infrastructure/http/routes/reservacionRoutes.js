const express = require('express');
const router = express.Router();

module.exports = (reservacionController) => {
  router.get('/', reservacionController.obtenerTodas);
  router.post('/', reservacionController.crear);
  router.put('/:id/estado', reservacionController.actualizarEstado);
  router.delete('/:id', reservacionController.eliminar);
  return router;
};