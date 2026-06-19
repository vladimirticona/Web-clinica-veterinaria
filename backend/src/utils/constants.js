const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_veterinaria';
const PORT = process.env.PORT || 3000;

module.exports = { JWT_SECRET, PORT };