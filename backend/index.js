const express = require('express');
const app = express();

const MySQLMascotaRepository = require('./src/infrastructure/persistence/MySQLMascotaRepository');
const MySQLReservacionRepository = require('./src/infrastructure/persistence/MySQLReservacionRepository');
const MySQLProductoRepository = require('./src/infrastructure/persistence/MySQLProductoRepository');
const MySQLUsuarioRepository = require('./src/infrastructure/persistence/MySQLUsuarioRepository');
const MySQLVeterinarioRepository = require('./src/infrastructure/persistence/MySQLVeterinarioRepository');

const MascotaService = require('./src/application/services/MascotaService');
const ReservacionService = require('./src/application/services/ReservacionService');
const ProductoService = require('./src/application/services/ProductoService');
const UsuarioService = require('./src/application/services/UsuarioService');
const VeterinarioService = require('./src/application/services/VeterinarioService');

const MascotaController = require('./src/infrastructure/http/controllers/mascotaController');
const ReservacionController = require('./src/infrastructure/http/controllers/reservacionController');
const ProductoController = require('./src/infrastructure/http/controllers/productoController');
const AuthController = require('./src/infrastructure/http/controllers/authController');
const VeterinarioController = require('./src/infrastructure/http/controllers/veterinarioController');

const mascotaRoutes = require('./src/infrastructure/http/routes/mascotaRoutes');
const reservacionRoutes = require('./src/infrastructure/http/routes/reservacionRoutes');
const productoRoutes = require('./src/infrastructure/http/routes/productoRoutes');
const authRoutes = require('./src/infrastructure/http/routes/authRoutes');
const veterinarioRoutes = require('./src/infrastructure/http/routes/veterinarioRoutes');

const authMiddleware = require('./src/infrastructure/http/middlewares/authMiddleware');

const mascotaRepository = new MySQLMascotaRepository();
const reservacionRepository = new MySQLReservacionRepository();
const productoRepository = new MySQLProductoRepository();
const usuarioRepository = new MySQLUsuarioRepository();
const veterinarioRepository = new MySQLVeterinarioRepository();

const mascotaService = new MascotaService(mascotaRepository, usuarioRepository, productoRepository);
const reservacionService = new ReservacionService(reservacionRepository, productoRepository);
const productoService = new ProductoService(productoRepository);
const usuarioService = new UsuarioService(usuarioRepository);
const veterinarioService = new VeterinarioService(veterinarioRepository);

const mascotaController = new MascotaController(mascotaService);
const reservacionController = new ReservacionController(reservacionService);
const productoController = new ProductoController(productoService);
const authController = new AuthController(usuarioService);
const veterinarioController = new VeterinarioController(veterinarioService);

app.use(express.json());

app.use('/auth', authRoutes(authController));
app.use('/mascotas', authMiddleware, mascotaRoutes(mascotaController));
app.use('/reservaciones', authMiddleware, reservacionRoutes(reservacionController));
app.use('/productos', authMiddleware, productoRoutes(productoController));
app.use('/veterinarios', authMiddleware, veterinarioRoutes(veterinarioController));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});