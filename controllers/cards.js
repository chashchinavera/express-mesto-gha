const { ValidationError, CastError } = require('mongoose').Error;
const cardModel = require('../models/card');
const BadRequestStatusError = require('../errors/BadRequestStatusError');
const NotFoundStatusError = require('../errors/NotFoundStatusError');
const ForbiddenStatusError = require('../errors/ForbiddenStatusError');
const {
  OK_STATUS,
  CREATED,
} = require('../utils/constants');

const getCards = (req, res, next) => {
  cardModel.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  cardModel.create({ name, link, owner: req.params.user_id })
    .then((card) => {
      res.status(CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestStatusError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  cardModel.findById(req.params.cardId)
    .then((card, err) => {
      if (!card) {
        throw new NotFoundStatusError('Запрашиваемая карточка не найдена');
      } else if (err instanceof CastError) {
        next(new BadRequestStatusError('По указанному id карточка не найдена'));
      } else if (req.user._id === card.owner.toString()) {
        return cardModel.findByIdAndRemove(req.params.cardId)
          .then(() => res.status(OK_STATUS).send({ message: 'Карточка удалена' }));
      } else {
        return next(new ForbiddenStatusError('Вы не можете удалить не ваши карточки'));
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card, err) => {
      if (!card) {
        throw new NotFoundStatusError('Запрашиваемая карточка не найдена');
      } else if (err instanceof CastError) {
        next(new BadRequestStatusError('По указанному id карточка не найдена'));
      }
      res.send({ data: card });
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card, err) => {
      if (!card) {
        throw new NotFoundStatusError('Запрашиваемая карточка не найдена');
      } else if (err instanceof CastError) {
        next(new BadRequestStatusError('По указанному id карточка не найдена'));
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
