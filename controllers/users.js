const bcrypt = require('bcryptjs');
const { CastError, ValidationError } = require('mongoose').Error;
const userModel = require('../models/user');
const { signToken } = require('../utils/jwtAuth');
const ConflictStatusError = require('../errors/ConflictStatusError');
const BadRequestStatusError = require('../errors/BadRequestStatusError');
const UnauthorizedStatusError = require('../errors/UnauthorizedStatusError');
const sendUser = require('../utils/sendUser');
const { CREATED } = require('../utils/constants');

const getUsers = (req, res, next) => {
  userModel.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  userModel.findById(req.params.user_id)
    .then((user) => sendUser(res, user))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestStatusError('По указанному id пользователь не найден'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)

    .then((hash) => {
      userModel.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(CREATED).send(user);
        })
        .catch((err) => {
          if (err instanceof ValidationError) {
            next(new BadRequestStatusError('Переданы некорректные данные'));
          } else if (err.code === 11000) {
            next(new ConflictStatusError('Такой пользователь уже существует'));
          } else {
            next(err);
          }
        });
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => sendUser(res, user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestStatusError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => sendUser(res, user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestStatusError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findOne({ email }).select('+password')
    .then((user) => {
      return Promise.all([user, bcrypt.compare(password, user.password)]);
    })
    .then(([user, isEqual]) => {
      if (!isEqual) {
        next(new UnauthorizedStatusError('Неверный логин или пароль'));
        return;
      }

      const token = signToken({ _id: user._id });
      console.log(token);

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
      })
    })

    .catch((err) => {
      if (err.message === 'Unauthorized') {
        next(new UnauthorizedStatusError('Неверный логин или пароль'));
      } else {
        next(err);
      }
    });
};

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
