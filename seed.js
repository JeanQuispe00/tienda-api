// Uso: npm run seed  -> crea productos de prueba y un usuario admin
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany([
    { name: 'Laptop Lenovo', description: '14 pulgadas, 16GB RAM', price: 2500, stock: 10, category: 'tecnología' },
    { name: 'Mouse inalámbrico', description: 'Ergonómico', price: 45.5, stock: 50, category: 'accesorios' },
    { name: 'Teclado mecánico', description: 'Switch rojo', price: 120, stock: 5, category: 'accesorios' },
    { name: 'Monitor 24"', description: 'Full HD', price: 600, stock: 8, category: 'tecnología' },
  ]);
  if (!(await User.findOne({ email: 'admin@tienda.com' }))) {
    await User.create({ name: 'Admin', email: 'admin@tienda.com', password: 'Admin123', role: 'admin' });
  }
  console.log('Seed completado. Admin: admin@tienda.com / Admin123');
  await mongoose.disconnect();
})();
