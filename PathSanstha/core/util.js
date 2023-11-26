export const emailValidator = (email) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return "Email cannot be empty.";
  if (!re.test(email)) return "Ooops! We need a valid email address.";

  return "";
};

export const passwordValidator = (password) => {
  if (!password || password.length < 3) return "Password cannot be empty.";

  return "";
};

export const nameValidator = (name) => {
  if (!name || name.length <= 0) return "Name cannot be empty.";

  return "";
};

export const required = (value) => {
  if (!value || value.length <= 0) return "Required.";
  return "";
};

export const stringValidator = (value) => {
  if (!value || value.length <= 0 || value.indexOf(" ") > 0)
    return "Invalid input.";

  return "";
};

export const benificieryNameValidator = (value) => {
  if (!value || value.length <= 0) return "Invalid input.";
  return "";
};

export const amountValidator = (value) => {
  if (!value || isNaN(value) || value > 200000) return "Invalid amount.";

  return "";
};
