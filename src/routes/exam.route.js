/* eslint-disable react/display-name */
import React from 'react';
import { Switch } from 'react-router-dom';
import AuthRoute from './AuthRoute';
import Exam from '../container/Exam/ListExam';
import AddExam from '../container/Exam/AddExam';
import EditExam from '../container/Exam/EditExam';


const routes = [
    {
        path: '/setting/exam',
        component: () => <Exam />,
        exact: true
    }, {
        path: '/setting/exam/add',
        component: () => <AddExam />,
        exact: true
    }, {
        path: '/setting/exam/:id',
        component: () => <EditExam />,
        exact: true
    }

];

const ExamRoute = () => {
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

export default ExamRoute;
