const notFound = (req, res, next) => {
  const err = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Error interno del servidor';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join('; ');
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Valor inválido para el campo ${err.path}`;
  } else if (err.code === 11000) {
    status = 409;
    message = `Ya existe un registro con ese valor de: ${Object.keys(err.keyValue).join(', ')}`;
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token inválido o expirado';
  } else if (err instanceof SyntaxError && err.status === 400) {
    message = 'JSON mal formado en el cuerpo de la petición';
  }

  if (status === 500) console.error(err);
  res.status(status).json({ success: false, message });
};

module.exports = { notFound, errorHandler };
