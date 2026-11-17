const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');

// GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ success: true, count: products.length, products });
});

// GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw httpError(404, 'Producto no encontrado');
  res.json({ success: true, product });
});

// POST /api/products (admin)
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const product = await Product.create({ name, description, price, stock, category });
  res.status(201).json({ success: true, product });
});
