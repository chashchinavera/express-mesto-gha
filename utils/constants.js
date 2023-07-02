const OK_STATUS = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN_ERROR = 403;
const NOT_FOUND = 404;
const CONFLICT_ERROR = 409;
const INTERNAL_SERVER_ERROR = 500;

const rule = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

const SECRET_KEY = 'super_secret';

module.exports = {
  OK_STATUS,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN_ERROR,
  NOT_FOUND,
  CONFLICT_ERROR,
  INTERNAL_SERVER_ERROR,
  rule,
  SECRET_KEY,
};
