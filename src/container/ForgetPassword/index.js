import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import { signInUser } from '../../actions/index';
import Form from './Form';
import blue from '../../assets/images/background/blue.svg';
import yellow from '../../assets/images/background/yellow.svg';

class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      errors: {},
      message: null
    };
  }

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

const MapDispatchToProp = (dispatch) => {
  return {
    signInUser: (data) => dispatch(signInUser(data))
  };
};

export default connect(null, MapDispatchToProp)(withRouter(ForgetPassword));
