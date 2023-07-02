const router = require('express').Router();
const notFoundPage = require('../utils/notFoundPage');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserLogin, validateUserBody } = require('../middlewares/validate');

router.post('/signin', validateUserLogin, login);
router.post('/signup', validateUserBody, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', notFoundPage);

module.exports = router;