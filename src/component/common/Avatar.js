import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOutUser } from '../../actions/index';
import { BASE_IMG } from '../../constants/config';

import user from '../../assets/images/icon/user-avatar-kn .svg';
import logout from '../../assets/images/icon/logout-avatar-kn.svg';
import UserDefault from '../../assets/images/images/icons/default-avatar.png';
const Avatar = (props) => {
  const { img, name, signOutUser, infoPosition } = props;
  const history = useHistory();
  const logOut = (e) => {
    e.preventDefault();
    signOutUser().then(() => history.push('/login'));
  };
  return (
    <>
      <div className="box-avatar">
        <div className="box-avatar-img">
          <img src={ img ? `${BASE_IMG}${img}` : UserDefault } alt="" />
        </div>
        <div className="box-avatar-content">
          <div className="box-avatar-content-name">
            <p>{name}</p>
            <p>{infoPosition && infoPosition.name}</p>
            <div className="box-avatar-info">
              <div className="box-avatar-info-avatar">
                <img src={ img ? `${BASE_IMG}${img}` : UserDefault } alt="" />
                <div className="box-avatar-info-avatar-name"> 
                  <p>{name}</p>
                </div>

              </div>
              <div className="box-avatar-info-footer">
                <Link to="/profile">
                  <div className="box-avatar-info-footer-box">
                  <img  src={user} alt=""/>
                  <p>Thông tin cá nhân</p>
                  </div>                  
                </Link>
                <div className="box-avatar-info-footer-box">
                <img src={logout} alt=""/>
                <p onClick={logOut} onKeyPress={() => { }} role="presentation">
                  Đăng xuất
                </p>
                </div>                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const MapDispatchToProp = (dispatch) => {
  return {
    signOutUser: () => dispatch(signOutUser())
  };
};

export default connect(null, MapDispatchToProp)(withRouter(Avatar));

Avatar.propTypes = {
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  signOutUser: PropTypes.object.isRequired
};
