import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';
import { checkError, getError } from '../../helpers/error';
import Alert from './Alert';

const InputPhoneCustom = React.forwardRef((props, ref) => {
  const { errors, defaultValue, ...input } = props;

  const [value, setValue] = useState({
    value: defaultValue || '',
    mask:
      defaultValue && defaultValue.length > 14
        ? '(99999) 999 999'
        : '(9999) 999 9999'
  });

  React.useEffect(() => {
    setValue({
      value: defaultValue || '',
      mask:
        defaultValue && defaultValue.length > 14
          ? '(99999) 999 999'
          : '(9999) 999 9999'
    });
  }, [defaultValue]);

  const onChange = (e) => {
    const val = e.target.value;

    const newState = {
      mask: '(9999) 999 9999',
      value: val
    };

    if (val.length > 14) {
      newState.mask = '(99999) 999 999';
    }

    setValue(newState);
  };

  return (
    <div className={checkError(errors, input.name)}>
      {input.label && <label className="input-label">{input.label}</label>}
      <InputMask
        {...value}
        onChange={onChange}
        maskPlaceholder={null}
        {...input}
      />
      <input type="hidden" ref={ref} value={value.value} />
      <Alert messsage={getError(errors, input.name)} />
    </div>
  );
});

export default InputPhoneCustom;

InputPhoneCustom.propTypes = {
  errors: PropTypes.isRequired,
  defaultValue: PropTypes.isRequired,
  input: PropTypes.isRequired,
  length: PropTypes.isRequired
};

