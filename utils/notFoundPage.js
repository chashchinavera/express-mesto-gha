const { NOT_FOUND } = require('./constants');

const notFoundPage = (req, res, next) => {
  next(res.status(NOT_FOUND).send({ message: 'Запрашиваемая страница не найдена' }));
};

module.exports = notFoundPage;
