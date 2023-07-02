const { checkToken } = require('../utils/jwtAuth').checkToken;
const UnauthorizedStatusError = require('../errors/UnauthorizedStatusError');

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new UnauthorizedStatusError('Пользователь не авторизован'));
  }

  const token = req.headers.authorization.replace('Bearer ', '');

  try {
    const payload = checkToken(token);

    req.user = {
      _id: payload._id,
    };
    next();
  } catch (err) {
    return next(new UnauthorizedStatusError('Пользователь не авторизован'));
  }
  return;
};

module.exports = auth;
