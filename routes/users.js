const router = require('express').Router();

const { validateUserId, validateUserInfo, validateUserAvatar } = require('../middlewares/validate');

const {
  getUsers,
  getUserById,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUser);

router.get('/:userId', validateUserId, getUserById);

router.patch('/me', validateUserInfo, updateProfile);

router.patch('/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;
