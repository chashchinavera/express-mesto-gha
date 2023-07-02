const INTERNAL_SERVER_ERROR = require('../utils/statusCode');

const error = ((err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message: 'Внутренняя ошибка сервера',
    err: err.message,
    stack: err.stack,
  });
  next();
});

module.exports = error;