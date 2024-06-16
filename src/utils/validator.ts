import { ValidOrError, ValidOrErrors } from "./error";
const { addError, addErrors } = require("./error.ts");

export const validate = (req: any, match: any) => {
  let valid: ValidOrErrors = { valid: true, errors: [] };
  for (const key in req) {
    if (match[key]) {
      addErrors(valid, check(req[key], match[key], key));
    }
  }
  return valid;
};

const check: (req: any, match: any, key: string) => ValidOrErrors = (
  req,
  match,
  key
) => {
  const params = match.split("|");

  let valid: ValidOrErrors = { valid: true, errors: [] };
  for (const param of params) {
    let [param1, param2] = param.split(":");
    switch (param1) {
      case "min":
        valid = addError(valid, checkMin(req.toString(), Number(param2)), key);
        break;
      case "max":
        valid = addError(valid, checkMax(req.toString(), Number(param2)), key);
        break;
      case "email":
        valid = addError(valid, checkEmail(req.toString()), key);
        break;
      case "type":
        valid = addError(valid, checkType(req, param2), key);
        break;
      default:
        break;
    }
  }
  return valid;
};
const checkMin: (req: string, match: number) => ValidOrError = (req, match) => {
  if (req.length < match) {
    return { valid: false, error: `length less than min ${match}` };
  }
  return { valid: true };
};

const checkMax: (req: string, match: number) => ValidOrError = (req, match) => {
  if (req.length > match) {
    return { valid: false, error: `length exceeds max ${match}` };
  }
  return { valid: true };
};

const checkEmail: (req: string) => ValidOrError = (req) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(req)) {
    return { valid: true };
  }
  return { valid: false, error: "Invalid email address" };
};

const checkType: (req: any, match: string) => ValidOrError = (req, match) => {
  switch (match) {
    case "date":
      const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-(\d{4})$/;
      if (dateRegex.test(req) && !isNaN(Date.parse(req))) {
        return { valid: true };
      }
      return { valid: false, error: `Not ${match}` };
    default:
      if (typeof req == match) {
        return { valid: true };
      }
      return { valid: false, error: `Not ${match}` };
  }
};
