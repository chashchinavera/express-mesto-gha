const { FORBIDDEN_ERROR } = require('../utils/constants');

class ForbiddenStatusError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR;
  }
}

module.exports = ForbiddenStatusError;
