/* eslint-disable react/display-name */
import React from 'react';
import { Switch } from 'react-router-dom';
import TableStudent from '../container/Student/TableStudent';
import NewStudent from '../container/Student/NewStudent';
import EditStudent from '../container/Student/EditStudent';
import CertificateStudent from '../container/Student/CertificateStudent';
import HistoryStudent from '../container/Student/HistoryStudent';
import RoleStudent from '../container/Student/RoleStudent';
import AuthRoute from './AuthRoute';
import AddCertificateStudent from '../container/Student/AddCertificateStudent';
import EditCertificateStudent from '../container/Student/EditCertificateStudent';

const routes = [
  {
    path: '/statistical/student',
    component: () => <TableStudent />,
    exact: true
  },
  {
    path: '/statistical/student/new',
    component: () => <NewStudent />,
    exact: true
  },
  {
    path: '/statistical/student/edit/:id',
    component: () => <EditStudent />,
    exact: true
  },
  {
    path: '/statistical/student/certificate/:id',
    component: () => <CertificateStudent />,
    exact: true
  },
  {
    path: '/statistical/student/:id/certificate/add',
    component: () => <AddCertificateStudent />,
    exact: true
  },
  {
    path: '/statistical/student/:id/certificate/edit/:idCertification',
    component: () => <EditCertificateStudent />,
    exact: true
  },
  {
    path: '/statistical/student/history/:id',
    component: () => <HistoryStudent />,
    exact: true
  },
  {
    path: '/statistical/student/role/:id',
    component: () => <RoleStudent />,
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
