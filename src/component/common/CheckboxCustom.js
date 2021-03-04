/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
const CheckboxCustom = React.forwardRef((props, ref) => {
  let { errors, id, label, wrapperClass, ...input } = props;
  return (
    <div className="custom-control custom-checkbox custom-checkbox-permission">
      <input
        type="checkbox"
        className="custom-control-input"
        {...input}
        id={id}
        ref={ref}
      />
      <label className="custom-control-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
});

export default CheckboxCustom;

CheckboxCustom.propTypes = {
  value: PropTypes.string.isRequired,
  errors: PropTypes.string.isRequired,
  wrapperClass: PropTypes.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.isRequired,
  input: PropTypes.isRequired
};
