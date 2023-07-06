const router = require('express').Router();

const { validateCard, validateCardId } = require('../middlewares/validate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.delete('/:cardId', validateCardId, deleteCard);

router.post('/', validateCard, createCard);

router.put('/:cardId', validateCardId, likeCard);

router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
