/* eslint-disable no-useless-escape */
/* eslint-disable react/display-name */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-date-picker';
import { checkError, getError } from '../../helpers/error';
import Alert from './Alert';
import { formatDate } from '../../helpers/form';

const Datepicker = React.forwardRef((props, ref) => {
  let { value, errors, label, name, defaultValue, ...input } = props;
  const valid = defaultValue instanceof Date;
  const today = new Date();
  if (defaultValue && !valid) {
    const pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
    defaultValue = new Date(defaultValue.replace(pattern, '$3-$2-$1'));
  } else {
    defaultValue = '';
  }

  const [date, setDate] = useState(defaultValue);

  // Set value when value of datepicker change kn
  React.useEffect(() => changeValue(), [value]);
  const changeValue = () => {
    if (value) {
      const pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
      value = new Date(value.replace(pattern, '$3-$2-$1'));
      setDate(value);
    } else if (value == '') {
      setDate('');
    }
  };

  const handleChangeDate = (date) => {
    setDate(date)
     //onChange doing somethings from props
     const { changeDate } = input;
     if(changeDate && typeof changeDate === 'function') {
       changeDate(formatDate(date));
     }
  }

  return (
    <div className={checkError(errors, name)}>
      {label && <label className="input-label">{label}</label>}
      <DateTimePicker
        onChange={(date) => handleChangeDate(date)}
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

export default Datepicker;

Datepicker.propTypes = {
  value: PropTypes.string.isRequired,
  errors: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  input: PropTypes.string.isRequired
};