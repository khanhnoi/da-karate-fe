import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import store from '../store/store';

const GuestRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const {
        user: { authenticated }
      } = store.getState();
      return !authenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/home',
            state: { from: props.location }
          }}
        />
      );
    }}
  />
);

GuestRoute.propTypes = {
  component: PropTypes.func,
  location: PropTypes.func
};

GuestRoute.defaultProps = {
  component: [],
  location: []
};

export default GuestRoute;
