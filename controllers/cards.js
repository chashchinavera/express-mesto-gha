const cardModel = require('../models/card');

const {
  CREATED,
  ERROR_CODE,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/statusCode');

const getCards = (req, res) => {
  cardModel.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  cardModel.create({ name, link, owner: req.params.user_id })
    .then((card) => {
      res.status(CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('Not found'))
    .then((card) => {
      if (!card) {
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'По указанному id карточка не найдена' });
      } else if (err.message === 'Not found') {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      } else if (req.user._id === cardModel.owner.toString()) {
        return cardModel.findByIdAndRemove(req.params.cardId)
          .then(() => res.status(200).send({ message: 'Карточка удалена' }));
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const likeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'По указанному id карточка не найдена' });
      } else if (err.message === 'Not found') {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const dislikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'По указанному id карточка не найдена' });
      } else if (err.message === 'Not found') {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
