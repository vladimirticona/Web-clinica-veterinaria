const express = require('express');
const router = express.Router();

module.exports = (mascotaController) => {
  router.get('/', mascotaController.obtenerTodas);
  router.get('/:id', mascotaController.obtenerPorId);
  router.post('/', mascotaController.crear);
  router.put('/:id', mascotaController.actualizar);
  router.delete('/:id', mascotaController.eliminar);
  return router;
};