import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input';
import { checkError, getError } from '../../helpers/error';
import Alert from './Alert';

const InputCurrency = React.forwardRef((props, ref) => {
  let { errors, ...input } = props;

  const [text, setText] = useState(input.defaultValue || '');

  const onChangeText = (event, maskedvalue, floatvalue) => {
    setText(floatvalue);
  };

  return (
    <div className={checkError(errors, input.name)}>
      {input.label && <label>{input.label}</label>}
      <CurrencyInput
        precision="0"
        value={text}
        onChangeEvent={onChangeText}
        {...input}
      />
      <input type="hidden" defaultValue={text} ref={ref} />
      <Alert messsage={getError(errors, input.name)} />
    </div>
  );
});

export default InputCurrency;
