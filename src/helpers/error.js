export const destructServerErrors = (error) => {
  if (error.response && error.response.data && error.response.data.errors) {
    return error.response.data.errors;
  }

  return [];
};

export const destructServerMessage = (error) => {
  if (
    error.response &&
    error.response.data &&
    error.response.data.message &&
    error.response.status !== 422
  ) {
    return error.response.data.message;
  }

  return null;
};

export const hasError = (errors, field) => {
  if (!Object.prototype.hasOwnProperty.call(errors, field)) {
    return false;
  }

  return errors[field] !== 1;
};

export const getError = (errors, field) => {
  if (!Object.prototype.hasOwnProperty.call(errors, field)) {
    return '';
  }
  const [error] = errors[field];
  return error;
};

export const checkError = (errors, key) => {
  return hasError(errors, key) ? 'form-group has-errors' : 'form-group';
};

export const checkErrorSingle = (errors, key) => {
  return hasError(errors, key) ? 'has-errors' : '';
};

export const checkErrorMultikey = (errors, key) => {
  if (key instanceof Array && errors) {
    return key.some(
      (item) => !Object.prototype.hasOwnProperty.call(errors, item)
    )
      ? 'form-group has-errors'
      : 'form-group';
  }
  return 'form-group';
};
