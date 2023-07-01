const router = require('express').Router();
const auth = require('../middlewares/auth');
const { validateUserBody } = require('../middlewares/validate');

const {
  getUsers,
  getUserById,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
} = require('../controllers/users');

router.post('/signin', login);

router.post('/signup', validateUserBody, createUser);

router.use(auth);

router.get('/users', getUsers);

router.get('/users/me', getUser);

router.get('/users/:userId', getUserById);

router.patch('/users/me', updateProfile);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
