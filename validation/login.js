const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};
  data.emailOrUsername = !isEmpty(data.emailOrUsername)
    ? data.emailOrUsername
    : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.emailOrUsername)) {
    errors.emailOrUsername = "Email or Username is required to login";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
