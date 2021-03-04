/* eslint-disable react/display-name */
import React from 'react';
import { Switch } from 'react-router-dom';
import TableDocument from '../container/Document/TableDocument';
import NewDocument from '../container/Document/NewDocument';
import EditDocument from '../container/Document/EditDocument';
import DetailDocument from '../container/Document/DetailDocument';
import CommonDocument from '../container/Document/CommonDocument';
import PrivateDocument from '../container/Document/PrivateDocument';
import SharedDocument from '../container/Document/SharedDocument';

import AuthRoute from './AuthRoute';

const routes = [
  {
    path: '/document/documents',
    component: () => <TableDocument />,
    exact: true
  },
  {
    path: '/document/new',
    component: () => <NewDocument />,
    exact: true
  },
  {
    path: '/document/edit/:id',
    component: () => <EditDocument />,
    exact: true
  },
  {
    path: '/document/detail/:id',
    component: () => <DetailDocument />,
    exact: true
  },
  {
    path: '/document/common',
    component: () => <CommonDocument />,
    exact: true
  },
  {
    path: '/document/private',
    component: () => <PrivateDocument />,
    exact: true
  },
  {
    path: '/document/share',
    component: () => <SharedDocument />,
    exact: true
  }
];

const StudentRoutes = () => {
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

export default StudentRoutes;
