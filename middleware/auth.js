const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');

// Verifica el JWT del header Authorization: Bearer <token>
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) throw httpError(401, 'No autorizado: falta el token');

  const token = header.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // lanza error si es inválido/expirado

  const user = await User.findById(decoded.id);
  if (!user) throw httpError(401, 'No autorizado: el usuario ya no existe');

  req.user = user;
  next();
});

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return next(httpError(403, 'Acceso denegado: se requiere rol admin'));
  next();
};

module.exports = { protect, adminOnly };
