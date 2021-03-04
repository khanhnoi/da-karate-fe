/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { checkError, getError } from '../../helpers/error';
import Alert from './Alert';

const TextArea = React.forwardRef((props, ref) => {
  const { errors, ...input } = props;
  return (
    <div className={checkError(errors, input.name)}>
      {input.label && <label className="input-label">{input.label}</label>}
      <textarea rows="12" cols="50" {...input} ref={ref} />
      <Alert messsage={getError(errors, input.name)} />
    </div>
  );
});

export default TextArea;

TextArea.propTypes = {
  errors: PropTypes.isRequired,
  input: PropTypes.isRequired
};
