import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  logger.error(err);

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered.';
  }

  // Joi validation error
  if (err.isJoi) {
    statusCode = 400;
    message = err.details[0].message;
  }

  res.status(statusCode).json({
    status: 'error',
    error: {
      code: statusCode === 500 ? 'INTERNAL_ERROR' : 'CLIENT_ERROR',
      message
    }
  });
};
