const checkToken = require('../utils/jwtAuth').checkToken;

const auth = (req, res, next) => {

  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Пользователь не авторизован' });
  }

  const token = req.headers.authorization.replace('Bearer ', '');

  try {
    const payload = checkToken(token);

    req.user = {
      _id: payload._id,
    };
    next();

  } catch (err) {
    return res.status(401).send({ message: 'Пользователь не авторизован' });
  }
};

module.exports = auth;
