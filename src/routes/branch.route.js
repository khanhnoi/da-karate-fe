/* eslint-disable react/display-name */
import React from 'react';
import { Switch } from 'react-router-dom';
import AuthRoute from './AuthRoute';
import Branch from '../container/Branch';
import BranchDetail from '../container/Branch/DetailBranch';
import AddBranch from '../container/Branch/AddBranch';

const routes = [
  {
    path: '/statistical/branch',
    component: () => <Branch />,
    exact: true
  },
  {
    path: '/statistical/branch/detail/:id',
    component: () => <BranchDetail />,
    exact: true
  },
  {
    path: '/statistical/branch/:type',
    component: () => <AddBranch />,
    exact: true
  },
  {
    path: '/statistical/branch/:type/:id',
    component: () => <AddBranch />,
    exact: true
  }
];

const BranchRoutes = () => {
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

export default BranchRoutes;
