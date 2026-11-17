const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });

const userResponse = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // El rol NO se acepta desde el cliente: siempre se crea como "user"
  const user = await User.create({ name, email, password });
  res.status(201).json({ success: true, token: signToken(user._id), user: userResponse(user) });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw httpError(400, 'Email y contraseña son obligatorios');

  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw httpError(401, 'Credenciales inválidas');

  res.json({ success: true, token: signToken(user._id), user: userResponse(user) });
});
