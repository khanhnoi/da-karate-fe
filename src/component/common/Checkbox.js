/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
const Checkbox = React.forwardRef((props, ref) => {
  let { errors, id, label, wrapperClass, value, ...input  } = props;
  const [checkBoxValue, setCheckBoxValue] = useState(value || false);



  return (
    <div className="custom-control custom-checkbox">
      <input
        type="checkbox"
        className="custom-control-input"
        id={id}
        ref={ref}
        value={checkBoxValue}
        checked={checkBoxValue} 
        onChange={checkboxValue => setCheckBoxValue(!checkBoxValue)}
        {...input}
      />
      <label className="custom-control-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
});

export default Checkbox;

Checkbox.propTypes = {
  value: PropTypes.string.isRequired,
  errors: PropTypes.string.isRequired,
  wrapperClass: PropTypes.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.isRequired,
  input: PropTypes.isRequired
};
