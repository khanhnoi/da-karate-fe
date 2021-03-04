/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { checkError, getError } from '../../helpers/error';
import Alert from './Alert';

const Select = React.forwardRef((props, ref) => {
  const {
    errors,
    data,
    key_value,
    key_label,
    label,
    include_blank,
    defaultValue,
    row,
    ...input
  } = props;
  return (
    <div
      className={
        row
          ? `${checkError(errors, input.name)} d-flex flex-wrap input-row`
          : checkError(errors, input.name)
      }
    >
      {label && <label className="input-label">{label}</label>}
      <select {...input} ref={ref}>
        {defaultValue ? (
          <option value={defaultValue[key_value]}>
            {defaultValue[key_label]}
          </option>
        ) : (
          include_blank && <option value="">{include_blank}</option>
        )}
        {data.map((item, index) => {
          return defaultValue ? (
            item[key_label] != defaultValue[key_label] && (
              <option key={index} value={item[key_value]}>
                {item[key_label]}
              </option>
            )
          ) : (
            <option key={index} value={item[key_value]}>
              {item[key_label]}
            </option>
          );
        })}
      </select>
      <Alert messsage={getError(errors, input.name)} />
    </div>
  );
});

export default Select;

Select.propTypes = {
  errors: PropTypes.isRequired,
  defaultValue: PropTypes.isRequired,
  label: PropTypes.isRequired,
  order: PropTypes.isRequired,
  name: PropTypes.isRequired,
  input: PropTypes.isRequired,
  data: PropTypes.isRequired,
  key_label: PropTypes.isRequired,
  key_value: PropTypes.isRequired,
  row: PropTypes.isRequired,
  include_blank: PropTypes.isRequired
};