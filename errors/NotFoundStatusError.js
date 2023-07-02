const { NOT_FOUND } = require('../utils/constants');

class NotFoundStatusError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

module.exports = NotFoundStatusError;
