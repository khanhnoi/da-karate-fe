/* eslint-disable react/display-name */
import React from 'react';
import { Switch } from 'react-router-dom';
import Course from '../container/Course';
import AddCourse from '../container/Course/AddCourse';
import EditCourse from '../container/Course/EditCourse';

import AuthRoute from './AuthRoute';

const routes = [
  {
    path: '/active/course',
    component: () => <Course />,
    exact: true
  },
  {
    path: '/active/course/new',
    component: () => <AddCourse />,
    exact: true
  },
  {
    path: '/active/course/edit/:id',
    component: () => <EditCourse />,
    exact: true
  }
];

const CourseRoutes = () => {
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

export default CourseRoutes;
