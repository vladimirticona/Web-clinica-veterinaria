const express = require('express');
const app = express();

// Repositorios en memoria habilitados para evitar dependencia directa a la base de datos
// y respetar la arquitectura hexagonal según indicaciones del profesor.
const InMemoryMascotaRepository = require('./src/infrastructure/persistence/InMemoryMascotaRepository');
const InMemoryReservacionRepository = require('./src/infrastructure/persistence/InMemoryReservacionRepository');
const InMemoryProductoRepository = require('./src/infrastructure/persistence/InMemoryProductoRepository');
const InMemoryDuenoRepository = require('./src/infrastructure/persistence/InMemoryDuenoRepository');

const MascotaService = require('./src/application/services/MascotaService');
const ReservacionService = require('./src/application/services/ReservacionService');
const ProductoService = require('./src/application/services/ProductoService');

const MascotaController = require('./src/infrastructure/http/controllers/mascotaController');
const ReservacionController = require('./src/infrastructure/http/controllers/reservacionController');
const ProductoController = require('./src/infrastructure/http/controllers/productoController');

const mascotaRoutes = require('./src/infrastructure/http/routes/mascotaRoutes');
const reservacionRoutes = require('./src/infrastructure/http/routes/reservacionRoutes');
const productoRoutes = require('./src/infrastructure/http/routes/productoRoutes');

const productoRepository = new InMemoryProductoRepository();
const duenoRepository = new InMemoryDuenoRepository();
const mascotaRepository = new InMemoryMascotaRepository(duenoRepository, productoRepository);
const reservacionRepository = new InMemoryReservacionRepository(productoRepository);

const mascotaService = new MascotaService(mascotaRepository, duenoRepository, productoRepository);
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