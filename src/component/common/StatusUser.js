import React from 'react';
import PropTypes from 'prop-types';

const StatusUser = (props) => {
  const { img, status, id, name } = props;
  const styleOn = {
    backgroundColor: '#2DCE98'
  };
  const styleOff = {
    backgroundColor: '#d14909'
  };
  const onMouseUser = (idDiv) => {
    document.querySelector(`#${idDiv}`).style.color = '#d6d315';
  };
  const onMouseLeaveUser = (idDiv) => {
    document.querySelector(`#${idDiv}`).style.color = '#fff';
  };
  return (
    <>
      <div className="box-user">
        <div
          className="status-user"
          onMouseOver={() => onMouseUser(id || 'idKN')}
          onMouseLeave={() => onMouseLeaveUser(id || 'idKN')}
          onFocus={() => {}}
        >
          <img src={img} alt="" className="status-user__icon" />
        </div>
        <div className="status-user__on" style={status ? styleOn : styleOff} />
        <div className="status-user__name">
          <p id={id || 'idKN'}>{name}</p>
        </div>
      </div>
    </>
  );
};

export default StatusUser;

StatusUser.propTypes = {
  img: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
