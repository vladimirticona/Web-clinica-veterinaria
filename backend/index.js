require('./tracing');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const MySQLMascotaRepository = require('./src/infrastructure/persistence/MySQLMascotaRepository');
const MySQLReservacionRepository = require('./src/infrastructure/persistence/MySQLReservacionRepository');
const MySQLProductoRepository = require('./src/infrastructure/persistence/MySQLProductoRepository');
const MySQLDueñoRepository = require('./src/infrastructure/persistence/MySQLDueñoRepository');
const MySQLAuthRepository = require('./src/infrastructure/persistence/MySQLAuthRepository');

const MascotaService = require('./src/application/services/MascotaService');
const ReservacionService = require('./src/application/services/ReservacionService');
const ProductoService = require('./src/application/services/ProductoService');
const AuthService = require('./src/application/services/AuthService');

const MascotaController = require('./src/infrastructure/http/controllers/mascotaController');
const ReservacionController = require('./src/infrastructure/http/controllers/reservacionController');
const ProductoController = require('./src/infrastructure/http/controllers/productoController');
const AuthController = require('./src/infrastructure/http/controllers/authController');

const mascotaRoutes = require('./src/infrastructure/http/routes/mascotaRoutes');
const reservacionRoutes = require('./src/infrastructure/http/routes/reservacionRoutes');
const productoRoutes = require('./src/infrastructure/http/routes/productoRoutes');
const authRoutes = require('./src/infrastructure/http/routes/authRoutes');

const mascotaRepository = new MySQLMascotaRepository();
const reservacionRepository = new MySQLReservacionRepository();
const productoRepository = new MySQLProductoRepository();
const dueñoRepository = new MySQLDueñoRepository();
const authRepository = new MySQLAuthRepository();

const mascotaService = new MascotaService(mascotaRepository, dueñoRepository, productoRepository);
const reservacionService = new ReservacionService(reservacionRepository, productoRepository);
const productoService = new ProductoService(productoRepository);
const authService = new AuthService(authRepository);

const mascotaController = new MascotaController(mascotaService);
const reservacionController = new ReservacionController(reservacionService);
const productoController = new ProductoController(productoService);
const authController = new AuthController(authService);

app.use(express.json());

app.use('/mascotas', mascotaRoutes(mascotaController));
app.use('/reservaciones', reservacionRoutes(reservacionController));
app.use('/productos', productoRoutes(productoController));
app.use('/auth', authRoutes(authController));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});