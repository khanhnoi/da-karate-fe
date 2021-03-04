/* eslint-disable react/display-name */
import React from 'react';
import { Switch } from 'react-router-dom';
import ListEvent from '../container/Event/ListEvent';
import AddEvent from '../container/Event/AddEvent';
import DetailEvent from '../container/Event/DetailEvent';
import EditEvent from '../container/Event/EditEvent';

import AuthRoute from './AuthRoute';

const routes = [
  {
    path: '/active/event',
    component: () => <ListEvent />,
    exact: true
  },
  {
    path: '/active/event/add',
    component: () => <AddEvent />,
    exact: true
  },
  {
    path: '/active/event/detail/:id',
    component: () => <DetailEvent />,
    exact: true
  },
  {
    path: '/active/event/edit/:id',
    component: () => <EditEvent />,
    exact: true
  }
];

const EventRoutes = () => {
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

export default EventRoutes;
