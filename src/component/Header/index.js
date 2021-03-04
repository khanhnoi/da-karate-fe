/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import bgHeader from '../../assets/images/bg-top-kn.svg';
import bell from '../../assets/images/icon/bell.svg';
import help from '../../assets/images/icon/help-circle.svg';
import Avatar from '../common/Avatar';

const Header = (props) => {
  const { title, text, user, isLoading } = props;
  return (
    <>
      <section
        className="header"
        style={{ backgroundImage: `url(${bgHeader})` }}
      >
        <div className="header-bg-above" />
        <div className="header-content">
          <div className="header-top">
            <div className="header-top-left">
              <Avatar
                img={user && user.user && user.user.avatar}
                name={user && user.user && user.user.name}
                infoPosition = {user && user.user && user.user.infoPosition}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.user,
    isLoading: state.Loading
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);

Header.propTypes = {
  title: PropTypes.isRequired,
  text: PropTypes.isRequired,
  user: PropTypes.isRequired,
  isLoading: PropTypes.isRequired,
};
