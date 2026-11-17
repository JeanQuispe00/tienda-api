const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');

// POST /api/orders
// Body: { "items": [ { "productId": "...", "quantity": 2 } ] }
exports.createOrder = asyncHandler(async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    throw httpError(400, 'Debes enviar un arreglo "items" con al menos un producto');
  }

  // Validar y unificar productos repetidos
  const merged = new Map();
  for (const it of items) {
    if (!mongoose.isValidObjectId(it.productId)) throw httpError(400, `productId inválido: ${it.productId}`);
    if (!Number.isInteger(it.quantity) || it.quantity < 1) {
      throw httpError(400, 'La cantidad debe ser un entero mayor o igual a 1');
    }
    merged.set(it.productId, (merged.get(it.productId) || 0) + it.quantity);
  }

  const reserved = []; // para restaurar stock si algo falla
  try {
    const orderItems = [];
    let total = 0;

    for (const [productId, quantity] of merged) {
      // Descuento atómico: solo si hay stock suficiente
      const product = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );

      if (!product) {
        const exists = await Product.findById(productId);
        if (!exists) throw httpError(404, `Producto no encontrado: ${productId}`);
        throw httpError(409, `Stock insuficiente para "${exists.name}". Disponible: ${exists.stock}, solicitado: ${quantity}`);
      }

      reserved.push({ productId, quantity });
      orderItems.push({ product: product._id, name: product.name, price: product.price, quantity });
      total += product.price * quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total: Math.round(total * 100) / 100,
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    // Rollback manual: devolver el stock ya descontado
    await Promise.all(
      reserved.map((r) => Product.updateOne({ _id: r.productId }, { $inc: { stock: r.quantity } }))
    );
    throw err;
  }
});

// GET /api/orders  (órdenes del usuario autenticado)
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, orders });
});

// PATCH /api/orders/:id/return
exports.returnOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw httpError(400, 'ID de orden inválido');

  const order = await Order.findById(id);
  if (!order) throw httpError(404, 'Orden no encontrada');

  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') throw httpError(403, 'No puedes devolver una orden que no es tuya');

  // Cambio de estado atómico: evita devolver dos veces la misma orden
  const updated = await Order.findOneAndUpdate(
    { _id: id, status: 'completada' },
    { status: 'devuelta', returnedAt: new Date() },
    { new: true }
  );
  if (!updated) throw httpError(409, 'La orden ya fue devuelta');

  // Restaurar stock
  await Promise.all(
    updated.items.map((it) => Product.updateOne({ _id: it.product }, { $inc: { stock: it.quantity } }))
  );

  res.json({ success: true, message: 'Orden devuelta y stock restaurado', order: updated });
});
