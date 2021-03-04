/* eslint-disable react/display-name */
import React from 'react';
import { Switch } from 'react-router-dom';
import ForgetPassword from '../container/ForgetPassword';
import AuthRoute from './AuthRoute';

const routes = [
  {
    path: '/forgot',
    component: () => <ForgetPassword />,
    exact: true
  }
];

const ForgetPasswordRoutes = () => {
  if (typeof window !== 'undefined') {
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

export default ForgetPasswordRoutes;
