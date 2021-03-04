/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { checkError, getError } from '../../helpers/error';
import Alert from './Alert';

const InputPhone = React.forwardRef((props, ref) => {
  const { errors, row, ...input } = props;
  const telEl = document.querySelector('#mobile');
  const validatePhone = (e) => {
    const val = e.target.value;
    e.target.value = val
      .replace(/\D/g, '')
      .replace(/(\d{1,4})(\d{1,3})?(\d{1,3})?/g, function (txt, f, s, t) {
        if (t) {
          return `${f}${s}${t}`;
        }
        if (s) {
          return `${f}${s}`;
        }
        if (f) {
          return `${f}`;
        }
      });
  };
  return (
    <div
      className={
        row
          ? `${checkError(errors, input.name)} d-flex flex-wrap`
          : checkError(errors, input.name)
      }
    >
      {input.label && (
        <label className={row ? 'input-label input-label-row' : 'input-label'}>
          {input.label}
        </label>
      )}
      <input
        {...input}
        ref={ref}
        type="text"
        id="mobile"
        size={10}
        maxLength={14}
        minLength={10}
        onChange={(e) => validatePhone(e)}
      />
      <Alert messsage={getError(errors, input.name)} row={row} />
    </div>
  );
});

export default InputPhone;

InputPhone.propTypes = {
  errors: PropTypes.isRequired,
  row: PropTypes.isRequired,
  input: PropTypes.isRequired,
};
