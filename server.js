require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'API Tienda Virtual funcionando' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Error al conectar con MongoDB:', err.message);
    process.exit(1);
  });
