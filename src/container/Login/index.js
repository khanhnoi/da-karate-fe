import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import createNotification from '../../component/common/Notifications';
import blue from '../../assets/images/background/blue.svg';
import yellow from '../../assets/images/background/yellow.svg';
import { signInUser } from '../../actions/index';
import {
  destructServerErrors,
  destructServerMessage
} from '../../helpers/error';
import Form from './Form';
import { showMessage } from '../../helpers/table';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      errors: {},
      message: null
    };
  }

  submitForm = (data) => {
    const { signInUsers, history } = this.props;
    this.setState({ isLoading: true });
    signInUsers(data)
      .then(() => history.push('/home'))
      .catch((error) => {
        this.setState({
          errors: destructServerErrors(error),
          message: destructServerMessage(error)
        });
        showMessage(destructServerMessage(error), false);
      });
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 500);
  };

  render() {
    const { errors, message, isLoading } = this.state;
    return (
      <>
        <section className="login">
          <div
            className="login-background"
            style={{ backgroundImage: `url(${yellow})` }}
          >
            <img className="login-background-bot" src={blue} alt="" />
          </div>
          <Form
            submitForm={this.submitForm}
            errors={errors}
            isLoading={isLoading}
            message={message}
          />
        </section>
        <NotificationContainer />
      </>
    );
  }
}

Login.propTypes = {
  signInUsers: PropTypes.func.isRequired,
  history: PropTypes.func.isRequired
};

const MapDispatchToProp = (dispatch) => {
  return {
    signInUsers: (data) => dispatch(signInUser(data))
  };
};

export default connect(null, MapDispatchToProp)(withRouter(Login));
