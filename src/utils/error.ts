export type ValidOrError = {
  valid: boolean;
  error?: string;
};

export type ValidOrErrors = {
  valid: boolean;
  errors: string[];
};

const addError: (
  validOrErrors: ValidOrErrors,
  validOrError: ValidOrError,
  key: string
) => ValidOrErrors = (validOrErrors, validOrError, key) => {
  if (validOrError.valid === false && validOrError.error) {
    validOrErrors.valid = false
    validOrErrors.errors.push(`${key}: ${validOrError.error}`);
  }
  return validOrErrors;
};

const addErrors: (
  validOrErrors1: ValidOrErrors,
  validOrErrors2: ValidOrErrors
) => ValidOrErrors = (validOrErrors1, validOrErrors2) => {
  if (validOrErrors2.valid === false) {
    validOrErrors1.valid = false
    validOrErrors1.errors.push(...validOrErrors2.errors);
  }
  return validOrErrors1;
};

module.exports = {addError, addErrors}