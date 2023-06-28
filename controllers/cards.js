const cardModel = require('../models/card');

const {
  CREATED,
  ERROR_CODE,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR
} = require('../utils/statusCode');

const getCards = (req, res) => {
  cardModel.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Внутренняя ошибка сервера',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  cardModel.create({ name, link, owner: req.params.user_id })
    .then((card) => {
      res.status(CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err.name = 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
          err: err.message,
          stack: err.stack,
        })
      }
    })
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: "Запрашиваемая карточка не найдена" })
      };
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name = 'CastError') {
        res.status(ERROR_CODE).send({ message: 'По указанному id карточка не найдена' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
          err: err.message,
          stack: err.stack
        })
      }
    })
};

const likeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name = 'CastError') {
        res.status(ERROR_CODE).send({ message: 'По указанному id карточка не найдена' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
          err: err.message,
          stack: err.stack
        })
      }
    })
};

const dislikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name = 'CastError') {
        res.status(ERROR_CODE).send({ message: 'По указанному id карточка не найдена' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
          err: err.message,
          stack: err.stack
        })
      }
    })
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}