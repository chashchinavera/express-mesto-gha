const { celebrate, Joi } = require('celebrate');

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().default().min(2).max(30),
    about: Joi.string().default().min(2).max(30),
    avatar: Joi.string().default(),
    email: Joi.string().required(),
    password: Joi.string().required().min(4),
  }),
});

module.exports = {
  validateUserBody,
};
