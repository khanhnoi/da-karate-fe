import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import logo from '../../assets/images/logo.svg';
import mailLogin from '../../assets/images/icon/poe.png';
import lockLogin from '../../assets/images/icon/lock-login.svg';
import createNotification from '../../component/common/Notifications';
import { hasError, getError } from '../../helpers/error';
export const Alert = (props) => {
  return props.message ? <div className="invalid-feedback" id="invalid-feedback-custom"> {props.message} </div> : '';
}

class Form extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    // doSomething();
  }

  onSubmit = (e) => {
    const { submitForm } = this.props;
    e.preventDefault();
    const mail = this.email.value.trim();
    const pass = this.password.value;
    const userLogin = {
      phone: mail,
      password: pass
    };
    submitForm(userLogin);
  };

  render() {
    let { errors } = this.props;
    return (
      <div className="form-body">
        <form className="login-form" onSubmit={this.onSubmit}>
          <img className="login-form-logo" src={logo} alt="" srcSet="" />
          <div className="login-form-wel">
            <p className="title-main-form">Chào mừng trở lại!</p>
          </div>

          <div className="login-form-input">
            <img className="login-form-input-img" src={mailLogin} alt="" />
            <input
              type="text"
              placeholder="Số điện thoại"
              name="email"
              ref={(c) => {
                this.email = c;
              }}
              onSubmit={(e) => this.onSubmit(e)}
            />
          </div>
          <Alert message={getError(errors, 'phone')} />
          <div className="login-form-input">
            <img className="login-form-input-img" src={lockLogin} alt="" />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              ref={(c) => {
                this.password = c;
              }}
            />
          </div>
          <Alert message={getError(errors, 'password')} />
          <div className="login-form-check">
            <div className="d-block login-form-check-forgot">
              <Link to="/forgot">Quên mật khẩu?</Link>
            </div>
          </div>
          <input
            onClick={(e) => this.onSubmit(e)}
            name=""
            id=""
            className="btn btn-primary login-form-btn"
            type="button"
            value="Đăng Nhập"
          />
        </form>
      </div>
    );
  }
}

export default connect(null, null)(withRouter(Form));

Form.propTypes = {
  submitForm: PropTypes.isRequired
};
