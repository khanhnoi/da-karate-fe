/* eslint-disable react/display-name */
import React from 'react';
import { Switch } from 'react-router-dom';
import AuthRoute from './AuthRoute';
import AddDonate from '../container/Donate/AddDonate';
import Donate from '../container/Donate';
import EditDonate from '../container/Donate/EditDonate';

const routes = [
  {
    path: '/donate',
    component: () => <Donate />,
    exact: true
  },
  {
    path: '/donate/add',
    component: () => <AddDonate />,
    exact: true
  },
  {
    path: '/donate/edit/:id',
    component: () => <EditDonate />,
    exact: true
  }
];

const DonateRoutes = () => {
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

export default DonateRoutes;
