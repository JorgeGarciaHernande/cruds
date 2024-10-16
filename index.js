const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json()); // Middleware para parsear JSON

// 1. Obtener todos los productos (READ)
app.get('/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// 2. Crear un nuevo producto (CREATE)
app.post('/products', async (req, res) => {
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

// 3. Actualizar un producto (UPDATE)
app.put('/products/:id', async (req, res) => {
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

// 4. Eliminar un producto (DELETE)
// Eliminar un producto (DELETE)
app.delete('/products/:id', async (req, res) => {
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
