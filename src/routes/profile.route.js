/* eslint-disable react/display-name */
import React from 'react';
import { Switch } from 'react-router-dom';
import Profile from '../container/Profile';
import AuthRoute from './AuthRoute';

const routes = [
  {
    path: '/profile',
    component: () => <Profile />,
    exact: true
  }
];

const ProfileRoutes = () => {
  if (typeof window != 'undefined') {
    return (
      <>
        <Switch>
          {routes.map((route) => (
            <AuthRoute key={route.path} {...route} />
          ))}
        </Switch>
      </>
    );
  }
  return '';
};

export default ProfileRoutes;
