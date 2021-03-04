import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import mailLogin from '../../assets/images/icon/mail-login.svg';

class Form extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="form-body">
        <form className="login-form" onSubmit={this.onSubmit}>
          <img className="login-form-logo" src={logo} alt="" srcSet="" />
          <div className="login-form-wel">
            <p>Bạn hãy nhập email mà bạn sử dụng trong hệ thống. Chúng tôi sẽ gửi một email xác nhận đến địa chỉ này</p>
          </div>

          <div className="login-form-input">
            <img className="login-form-input-img" src={mailLogin} alt="" />
            <input
              type="text"
              placeholder="Email"
              name="email"
              ref={(c) => {
                this.email = c;
              }}
              onSubmit={(e) => this.onSubmit(e)}
            />
          </div>
          <input
            onClick={(e) => this.onSubmit(e)}
            name=""
            id=""
            className="btn btn-primary login-form-btn"
            type="button"
            value="Khôi phục mật khẩu"
          />
        </form>
      </div>
    );
  }
}

export default connect(null, null)(withRouter(Form));
