/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';

const InputForm = React.forwardRef((props) => {
  const { title, id, placeholder } = props;
  return (
    <>
      <div className="form-group form-add__box">
        <label htmlFor={id}>{title}</label>
        <input
          type="text"
          className="form-control form-add__box__input"
          name
          id={id}
          aria-describedby="helpId"
          placeholder={placeholder}
        />
      </div>
    </>
  );
});

export default InputForm;

InputForm.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired
};
