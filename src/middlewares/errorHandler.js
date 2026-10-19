import { AppError } from '../errors/AppError.js';

export function errorHandler(error, req, res, next) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El body no es un JSON válido' });
  }

  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor' });
}