import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-date-picker';
import { checkError, getError } from '../../helpers/error';
import Alert from './Alert';
import { formatDate } from '../../helpers/form';

const DatepickerCustom = React.forwardRef((props, ref) => {
  let { value, errors, label, name, defaultValue, ...input } = props;
  let valid = defaultValue instanceof Date;
  let today = new Date();
  if (defaultValue && !valid) {
    let pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
    defaultValue = new Date(defaultValue.replace(pattern, '$3-$2-$1'));
  } else defaultValue = '';

  const [date, setDate] = useState(defaultValue);

  // Set value when value of datepicker change
  React.useEffect(() => changeValue(), [value]);
  const changeValue = () => {
    if (value) {
      let pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
      value = new Date(value.replace(pattern, '$3-$2-$1'));
      setDate(value);
    } else if (value == '') {
      setDate('');
    }
  };
  return (
    <div className={checkError(errors, name)}>
      {label && <label htmlFor="">{label}</label>}
      <DateTimePicker
        onChange={(date) => setDate(date)}
        value={date}
        name={name}
        {...input}
        locale="vi"
        dayPlaceholder={today.getDate()}
        monthPlaceholder={today.getMonth() + 1}
        yearPlaceholder={today.getFullYear()}
      />
      <input type="hidden" ref={ref} name={name} value={formatDate(date)} />
      <Alert messsage={getError(errors, name)} />
    </div>
  );
});

export default DatepickerCustom;
