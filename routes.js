const express = require('express');
const { login } = require('./authController');  // Importa el controlador de login
const verificarJWT = require('./authMiddleware');  // Importa el middleware de autenticación

const app = express();

// Ruta de inicio de sesión para generar el JWT
app.post('/login', login);

// Ruta protegida con el middleware JWT
app.get('/products', verificarJWT, (req, res) => {
  res.json({ message: 'Lista de productos disponible solo para usuarios autenticados' });
});

module.exports = app;
