require('./tracing');
const express = require('express');
const app = express();

const MySQLMascotaRepository = require('./src/infrastructure/persistence/MySQLMascotaRepository');
const MySQLReservacionRepository = require('./src/infrastructure/persistence/MySQLReservacionRepository');
const MySQLProductoRepository = require('./src/infrastructure/persistence/MySQLProductoRepository');

const MascotaService = require('./src/application/services/MascotaService');
const ReservacionService = require('./src/application/services/ReservacionService');
const ProductoService = require('./src/application/services/ProductoService');

const MascotaController = require('./src/infrastructure/http/controllers/mascotaController');
const ReservacionController = require('./src/infrastructure/http/controllers/reservacionController');
const ProductoController = require('./src/infrastructure/http/controllers/productoController');

const mascotaRoutes = require('./src/infrastructure/http/routes/mascotaRoutes');
const reservacionRoutes = require('./src/infrastructure/http/routes/reservacionRoutes');
const productoRoutes = require('./src/infrastructure/http/routes/productoRoutes');

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