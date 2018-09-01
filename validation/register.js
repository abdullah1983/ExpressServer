const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  const errors = {};
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // Check if any of the fields are empty
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName =
      "First Name is a required field. You just can't leave it empty";
  }
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName =
      "Last Name is a required field. You just can't leave it empty";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is a required field. You just can't leave it empty";
  }
  if (Validator.isEmpty(data.username)) {
    errors.username =
      "Username is a required field. You just can't leave it empty";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password =
      "Password is a required field. You just can't leave it empty";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 =
      "Confirm Password is a required field. You just can't leave it empty";
  }

  // First Name Validations
  if (!Validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors.firstName = "First Name must be between 2 and 30 characters.";
  }

  // Last Name Validations
  if (!Validator.isLength(data.lastName, { min: 2, max: 30 })) {
    errors.lastName = "Last Name must be between 2 and 30 characters.";
  }
  // Email Validations
  if (!Validator.isEmail(data.email)) {
    errors.email =
      "This is not a vaild email address. Please enter a valid email address.";
  }
  // Username Validations
  if (!Validator.isLength(data.username, { min: 3, max: 35 })) {
    errors.username = "Username must be between 3 and 35 characters.";
  }
  if (!Validator.matches(data.username, "^[a-zA-Z0-9_.-]*$")) {
    errors.username =
      "Username can only be alphanumeric and contain '.' '-' '_'";
  }

  // Password Validations
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 and 30 characters";
  }

  if (!Validator.isLength(data.password2, { min: 6, max: 30 })) {
    errors.password2 = "Password must be between 6 and 30 characters";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
