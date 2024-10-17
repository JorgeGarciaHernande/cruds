const express = require('express');
const cors = require('cors');
const pool = require('./db');
const jwt = require('jsonwebtoken');  // Importar JWT
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json()); // Middleware para parsear JSON

// Clave secreta para firmar los JWT
const JWT_SECRET = process.env.JWT_SECRET || 'miClaveSecreta';

// Middleware para verificar el JWT
const verificarJWT = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
    req.user = decoded;
    next();
  });
};

// 1. Ruta de inicio de sesión (LOGIN)
// Generar JWT tras la autenticación
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Ejemplo básico de autenticación (reemplazar por una validación real)
  if (username === 'usuarioEjemplo' && password === 'contraseñaEjemplo') {
    // Generar JWT válido por 3 minutos
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '3m' });
    return res.json({ token });
  }

  res.status(401).json({ error: 'Credenciales incorrectas' });
});

// 2. Obtener todos los productos (READ) - Protegido por JWT
app.get('/products', verificarJWT, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// 3. Crear un nuevo producto (CREATE) - Protegido por JWT
app.post('/products', verificarJWT, async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const newProduct = await pool.query(
      'INSERT INTO products (name, price, quantity) VALUES ($1, $2, $3) RETURNING *',
      [name, price, quantity]
    );
    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// 4. Actualizar un producto (UPDATE) - Protegido por JWT
app.put('/products/:id', verificarJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity } = req.body;
    await pool.query(
      'UPDATE products SET name = $1, price = $2, quantity = $3 WHERE id = $4',
      [name, price, quantity, id]
    );
    res.json({ message: 'Producto actualizado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// 5. Eliminar un producto (DELETE) - Protegido por JWT
app.delete('/products/:id', verificarJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
