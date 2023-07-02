const sendUser = (res, data) => {
  if (!data) {
    throw new NotFoundStatusError('Запрашиваемый пользователь не найден');
  }
  res.status(OK_STATUS).send({ data });
};

module.exports = sendUser;
