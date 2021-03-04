import React from 'react';
import PropTypes from 'prop-types';

const ButtonSave = (props) => {
  const { text, onClick, ...input } = props;

  return (
    <>
      <button className="button-new ml-auto mr-3" onClick={onClick} {...input}>
        <span>{text}</span>
      </button>
    </>
  );
};

export default ButtonSave;

ButtonSave.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.isRequired,
  input: PropTypes.isRequired
};

