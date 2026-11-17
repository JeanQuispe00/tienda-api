const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    description: { type: String, trim: true, default: '' },
    price: { type: Number, required: [true, 'El precio es obligatorio'], min: [0, 'El precio no puede ser negativo'] },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      validate: { validator: Number.isInteger, message: 'El stock debe ser un número entero' },
    },
    category: { type: String, trim: true, default: 'general' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
