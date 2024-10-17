const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verificarJWT = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    req.user = decoded;  // Guardar los datos del usuario en la solicitud
    next();  // Continuar a la siguiente función
  });
};

module.exports = verificarJWT;
