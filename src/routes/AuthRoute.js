import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import store from '../store/store';

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const {
        user: { authenticated }
      } = store.getState();
      return authenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      );
    }}
  />
);

AuthRoute.propTypes = {
  component: PropTypes.func,
  location: PropTypes.func
};

AuthRoute.defaultProps = {
  component: [],
  location: []
};

export default AuthRoute;
