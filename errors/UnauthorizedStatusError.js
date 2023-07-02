const { UNAUTHORIZED } = require('../utils/constants');

class UnauthorizedStatusError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = UnauthorizedStatusError;
