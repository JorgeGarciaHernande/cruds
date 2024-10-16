const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carga las variables de entorno

const app = express();

// Usa el puerto que Render proporciona o el 4000 como fallback
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta básica para verificar el funcionamiento del servidor
app.get('/', (req, res) => {
  res.send('¡El servidor está corriendo correctamente!');
});

// Levantar el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
