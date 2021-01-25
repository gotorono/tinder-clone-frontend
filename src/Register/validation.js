import Validator from "validator";
import isEmpty from "is-empty";

export default function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.passwordRepeat = !isEmpty(data.passwordRepeat)
    ? data.passwordRepeat
    : "";
  data.birthDate = !isEmpty(data.birthDate) ? data.birthDate : "";
  data.gender = !isEmpty(data.gender) ? data.gender : "";
  data.orientation = !isEmpty(data.orientation) ? data.orientation : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.image = !isEmpty(data.image) ? data.image : "";

  if(Validator.isEmpty(data.image)) {
      errors.image = "Profile image is required";
  }
 
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.emailinvalid = "Email is invalid";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (Validator.isEmpty(data.passwordRepeat)) {
    errors.passwordRepeat = "Confirm password field is required";
  }

  if (data.birthDate === "") {
    errors.birthDate = "Birth date is empty";
  }

  if (Validator.isEmpty(data.gender)) {
    errors.gender = "Gender is not selected";
  } else if (!Validator.isIn(data.gender, ["M", "F", "U"])) {
    errors.gender = "Unknown gender " + data.gender;
  }

  if (Validator.isEmpty(data.orientation)) {
    errors.orientation = "Orientation is not selected";
  } else if (!Validator.isIn(data.orientation, ["hetero", "homo", "bi"])) {
    errors.orientation = "Unknown orientation " + data.orientation;
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (!Validator.equals(data.password, data.passwordRepeat)) {
    errors.passwordRepeat = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}
