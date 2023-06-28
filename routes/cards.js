const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.delete('/cards/:cardId', deleteCard);

router.post('/cards', createCard);

router.put('/cards/:cardId', likeCard);

router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
