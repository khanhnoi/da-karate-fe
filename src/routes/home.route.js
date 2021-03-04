/* eslint-disable react/display-name */
import React from 'react';
import { Switch } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import AuthRoute from './AuthRoute';
import Menu from '../component/Menu';
import Homepage from '../container/Home/index';
import ForgetPasswordRoutes from './forget.route';
import ProfileRoutes from './profile.route';
import Header from '../component/Header';
import 'react-notifications/lib/notifications.css';
import StudentRoutes from './student.route';
import DocumentRoutes from './document.route';
import LibraryRoutes from './libraries.route';
import PermissionRoutes from './permission.route';
import ClubRoutes from './club.route';
import BranchRoutes from './branch.route';
import CompetitonRoutes from './competition.route';
import ExamRoutes from './exam.route';
import EventRoutes from './event.route';
import CourseRoutes from './course.route';
import DonateRoutes from './donate.route';

export const routes = [
  // Home page
  {
    path: '/',
    component: () => <Homepage />,
    exact: true
  },
  {
    path: '/home',
    component: () => <Homepage />,
    exact: true
  },
  {
    path: '/forgot',
    component: () => <ForgetPasswordRoutes />
  },
  {
    path: '/profile',
    component: () => <ProfileRoutes />
  },
  {
    path: '/statistical/student',
    component: () => <StudentRoutes />
  },
  {
    path: '/statistical/club',
    component: () => <ClubRoutes />
  },
  {
    path: '/statistical/branch',
    component: () => <BranchRoutes />
  },
  {
    path: '/document',
    component: () => <DocumentRoutes />
  },
  {
    path: '/libraries',
    component: () => <LibraryRoutes />
  },
  {
    path: '/setting/permission',
    component: () => <PermissionRoutes />
  },
  {
    path: '/setting/exam',
    component: () => <ExamRoutes />
  },
  {
    path: '/active/competition',
    component: () => <CompetitonRoutes />
  },
  {
    path: '/active/event',
    component: () => <EventRoutes />
  },
  {
    path: '/active/course',
    component: () => <CourseRoutes />
  },
  {
    path: '/donate',
    component: () => <DonateRoutes />
  }
];

const HomeRoutes = () => {
  if (typeof window !== 'undefined') {
    return (
      <>
        <NotificationContainer />
        <Menu />
        <div className="body-right" id="page-wrapper">
          <Header />
          <Switch>
            {routes.map((route) => (
              <AuthRoute key={route.path} {...route} />
            ))}
          </Switch>
        </div>
      </>
    );
  }
  return '';
};

export default HomeRoutes;
