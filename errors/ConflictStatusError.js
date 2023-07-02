const { CONFLICT_ERROR } = require('../utils/constants');

class ConflictStatusError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}

module.exports = ConflictStatusError;
