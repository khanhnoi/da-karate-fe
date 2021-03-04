/* eslint-disable react/display-name */
import React from 'react';
import { Switch } from 'react-router-dom';
import Competition from '../container/Competition/Competition';
import AddCompetition from '../container/Competition/AddCompetition';
import Manage from '../container/Competition/Manage';
import Edit from '../container/Competition/EditCompettion';

import AuthRoute from './AuthRoute';

const routes = [
  {
    path: '/active/competition',
    component: () => <Competition />,
    exact: true
  },
  {
    path: '/active/competition/add',
    component: () => <AddCompetition />,
    exact: true
  },
  {
    path: '/active/competition/manage/:id',
    component: () => <Manage />,
    exact: true
  },
  {
    path: '/active/competition/edit/:id',
    component: () => <Edit />,
    exact: true
  }
];

const CompetitionRoutes = () => {
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

export default CompetitionRoutes;
