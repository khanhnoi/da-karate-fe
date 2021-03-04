/* eslint-disable react/display-name */
import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Login from '../container/Login/index';
import HomeRoutes from './home.route';
import GuestRoute from './GuestRoute';
import AuthRoute from './AuthRoute';
import ForgetPassword from '../container/ForgetPassword';
import { initUserFromToken } from '../actions';
import Loading from '../assets/images/loading.gif';

export const routes = [
  {
    path: '/*',
    component: (props) => <HomeRoutes {...props} />,
    exact: true
  },
  {
    path: '/login',
    component: () => <Login />,
    exact: false,
    layout: 'login'
  }
];

class Routes extends Component {
  componentDidMount() {
    const { getUser } = this.props;
    getUser();
  }

  render() {
    const { isLoading } = this.props;
    if (isLoading) {
      return (
        <div className="main-loading">
          <img src={Loading} alt="loading" />
        </div>
      );
    }

    return (
      <>
        <Switch>
          <GuestRoute path="/login" component={Login} />
          <GuestRoute path="/forgot" component={ForgetPassword} />
          {routes.map((route) => (
            <AuthRoute key={route.path} {...route} />
          ))}
        </Switch>
      </>
    );
  }
}

Routes.propTypes = {
  isLoading: PropTypes.bool,
  getUser: PropTypes.func
};

Routes.defaultProps = {
  isLoading: true,
  getUser: []
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    isLoading: state.Loading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: () => dispatch(initUserFromToken())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Routes);
