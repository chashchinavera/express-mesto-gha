const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const signToken = require('../utils/jwtAuth').signToken;

const {
  CREATED,
  ERROR_CODE,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  MONGO_DUPLICATE_KEY_ERROR,
  CONFLICT_ERROR,
} = require('../utils/statusCode');

const getUsers = (req, res) => {
  userModel.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'По указанному id пользователь не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const getUserById = (req, res) => {
  userModel.findById(req.params.user_id)
    .orFail(new Error('Not found'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'По указанному id пользователь не найден' });
      } else if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then(function (hash) {

    userModel.create({ name, about, avatar, email, password: hash })
      .then((user) => {

        res.status(CREATED).send(user);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        } else if (err.code === MONGO_DUPLICATE_KEY_ERROR) {
          res.status(CONFLICT_ERROR).send({ message: 'Такой пользователь уже существует' });
          return;
        } else {
          res.status(INTERNAL_SERVER_ERROR).send({
            message: 'Внутренняя ошибка сервера',
            err: err.message,
            stack: err.stack,
          });
        }
      });
  });
};

const updateProfile = (req, res, next) => {
  userModel.findByIdAndUpdate(req.user._id, req.body)
    .orFail(new Error('Not found'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'По указанному id пользователь не найден' });
      } else if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
        next(err);
      }
    });
};

const updateAvatar = (req, res) => {
  userModel.findByIdAndUpdate(req.user._id, req.body)
    .orFail(new Error('Not found'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'По указанному id пользователь не найден' });
      } else if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Внутренняя ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  userModel.findOne({ email }).select('+password')
    .orFail(new Error('Unauthorized'))
    .then((user) => {
      return Promise.all([user, bcrypt.compare(password, user.password)]);
    })
    .then(([user, isEqual]) => {
      if (!isEqual) {
        res.status(UNAUTHORIZED).send({ message: 'Неверный логин или пароль' });
        return;
      }

      const token = signToken({ _id: user._id });
      console.log(token);


      res.cookie('token', token, {
        httpOnly: true,
      });
      res.status(200).send({ token });
    })

    .catch((err) => {
      if (err.message === 'Unauthorized') {
        res.status(UNAUTHORIZED).send({ message: 'Неверный логин или пароль' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Внутренняя ошибка сервера',
        err: err.message,
        stack: err.stack,
      })
    });
}

const getUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((data) => {
      res.status(200).send({ data });

    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
