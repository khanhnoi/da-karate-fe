/* eslint-disable react/display-name */
import React from 'react';
import { Switch } from 'react-router-dom';
import TablePermission from '../container/Permission/TablePermission';
import NewPermission from '../container/Permission/NewPermission';
import EditPermission from '../container/Permission/EditPermission';
import AuthRoute from './AuthRoute';

const routes = [
  {
    path: '/setting/permission',
    component: () => <TablePermission />,
    exact: true
  },
  {
    path: '/setting/permission/new',
    component: () => <NewPermission />,
    exact: true
  },
  {
    path: '/setting/permission/edit/:id',
    component: () => <EditPermission />,
    exact: true
  }
];

const PermissionRoutes = () => {
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

export default PermissionRoutes;
