const express = require('express');
const app = express();

const MySQLMascotaRepository = require('./infrastructure/persistence/MySQLMascotaRepository');
const MySQLReservacionRepository = require('./infrastructure/persistence/MySQLReservacionRepository');
const MySQLProductoRepository = require('./infrastructure/persistence/MySQLProductoRepository');

const MascotaService = require('./application/services/MascotaService');
const ReservacionService = require('./application/services/ReservacionService');
const ProductoService = require('./application/services/ProductoService');

const MascotaController = require('./infrastructure/http/controllers/mascotaController');
const ReservacionController = require('./infrastructure/http/controllers/reservacionController');
const ProductoController = require('./infrastructure/http/controllers/productoController');

const mascotaRoutes = require('./infrastructure/http/routes/mascotaRoutes');
const reservacionRoutes = require('./infrastructure/http/routes/reservacionRoutes');
const productoRoutes = require('./infrastructure/http/routes/productoRoutes');

const mascotaRepository = new MySQLMascotaRepository();
const reservacionRepository = new MySQLReservacionRepository();
const productoRepository = new MySQLProductoRepository();

const mascotaService = new MascotaService(mascotaRepository, null, productoRepository);
const reservacionService = new ReservacionService(reservacionRepository, productoRepository);
const productoService = new ProductoService(productoRepository);

const mascotaController = new MascotaController(mascotaService);
const reservacionController = new ReservacionController(reservacionService);
const productoController = new ProductoController(productoService);

app.use(express.json());

app.use('/mascotas', mascotaRoutes(mascotaController));
app.use('/reservaciones', reservacionRoutes(reservacionController));
app.use('/productos', productoRoutes(productoController));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});