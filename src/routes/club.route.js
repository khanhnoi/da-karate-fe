/* eslint-disable react/display-name */
import React from 'react';
import { Switch } from 'react-router-dom';
import Club from '../container/Club';
import ClubDetail from '../container/Club/ClubDetail';
import AddClub from '../container/Club/AddClub';
import EditClub from '../container/Club/EditClub';

import AuthRoute from './AuthRoute';

const routes = [
  {
    path: '/statistical/club',
    component: () => <Club />,
    exact: true
  },
  {
    path: '/statistical/club/addClub',
    component: () => <AddClub />,
    exact: true
  },
  {
    path: '/statistical/club/id/:id',
    component: () => <ClubDetail />,
    exact: true
  },
  {
    path: '/statistical/club/edit/:id',
    component: () => <EditClub />,
    exact: true
  }
];

const ClubRoutes = () => {
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

export default ClubRoutes;
