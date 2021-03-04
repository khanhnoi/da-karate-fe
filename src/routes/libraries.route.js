/* eslint-disable react/display-name */
import React from 'react';
import { Switch } from 'react-router-dom';
import TableLibrary from '../container/Library/TableLibrary';
import NewLibrary from '../container/Library/NewLibrary';
import EditLibrary from '../container/Library/EditLibrary';
import DetailLibrary from '../container/Library/DetailLibrary';
import EbookLibrary from '../container/Library/EbookLibrary';
import PhotoLibrary from '../container/Library/PhotoLibrary';
import DocLibrary from '../container/Library/DocLibrary';
import VideoLibrary from '../container/Library/VideoLibrary';

import AuthRoute from './AuthRoute';

const routes = [
  {
    path: '/libraries',
    component: () => <TableLibrary />,
    exact: true
  },
  {
    path: '/libraries/new',
    component: () => <NewLibrary />,
    exact: true
  },
  {
    path: '/libraries/edit/:id',
    component: () => <EditLibrary />,
    exact: true
  },
  {
    path: '/libraries/detail/:id',
    component: () => <DetailLibrary />,
    exact: true
  },
  {
    path: '/libraries/ebook',
    component: () => <EbookLibrary />,
    exact: true
  },
  {
    path: '/libraries/photo',
    component: () => <PhotoLibrary />,
    exact: true
  },
  {
    path: '/libraries/document',
    component: () => <DocLibrary />,
    exact: true
  },
  {
    path: '/libraries/video',
    component: () => <VideoLibrary />,
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
