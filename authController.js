const jwt = require('jsonwebtoken');

// Función para generar el token JWT
const generarJWT = (userId) => {
  const payload = { id: userId };  // Información que quieres incluir en el token
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3m' });  // Token válido por 3 minutos
  return token;
};

// Ejemplo de cómo se usaría después de un login exitoso
const login = (req, res) => {
  const { username, password } = req.body;

  // Aquí validarías el usuario con la base de datos...
  const userId = 123;  // Suponemos que el ID del usuario es 123 después de validarlo

  // Generar el JWT
  const token = generarJWT(userId);

  // Devolver el token al cliente
  res.json({ token });
};

module.exports = { login };
