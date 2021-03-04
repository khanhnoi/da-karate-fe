/* eslint-disable camelcase */
import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types';
import InputText from '../../component/common/InputText';
import { showMessage } from '../../helpers/table';
import { putDataWithUrl } from '../../services/base_services';
import { destructServerErrors } from '../../helpers/error';
import { CHANGE_PASSWORD } from '../../constants/config';

class FormChangePass extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: true,
      errors: {}
    };
  }

  closeModal = () => {
    const { onClosePopup } = this.props;
    this.setState({ open: false });
    onClosePopup();
  };

  onSubmitForm = (e) => {
    e.preventDefault();
    const { onClosePopup } = this.props;
    const data = {
      old_pass: this.old_pass.value,
      new_pass: this.new_pass.value,
      re_pass: this.re_pass.value
    };
    return putDataWithUrl(CHANGE_PASSWORD, data)
      .then((res) => {
        onClosePopup();
        showMessage(res.data.message, true);
        return Promise.resolve({ data: res.data });
      })
      .catch((err) => {
        const msg = destructServerErrors(err);
        showMessage('CÓ LỖI XẢY RA!', false);
        this.setState({
          errors: msg
        });
      });
  };

  render() {
    const { errors, open } = this.state;
    return (
      <>
        <Popup open={open} modal>
          <div className="modal-custom">
            <div className="popup-header text-center">Thay đổi mật khẩu</div>
            <div className="popup-body">
              <form className="form-change-pass" onSubmit={this.onSubmitForm}>
                <div className="row">
                  <div className="col-md-12">
                    <InputText
                      name="old_pass"
                      ref={(c) => {
                        this.old_pass = c;
                      }}
                      label="Mật khẩu hiện tại (*)"
                      type="password"
                      className="form-control input-form"
                      placeholder="Nhập mật khẩu cũ"
                      errors={errors}
                    />
                  </div>
                  <div className="col-md-12">
                    <InputText
                      name="new_pass"
                      ref={(c) => {
                        this.new_pass = c;
                      }}
                      label="Mật khẩu mới (*)"
                      type="password"
                      className="form-control input-form"
                      placeholder="nhập mật khẩu mới"
                      errors={errors}
                    />
                  </div>
                  <div className="col-md-12">
                    <InputText
                      name="re_pass"
                      ref={(c) => {
                        this.re_pass = c;
                      }}
                      label="Nhập lại mật khẩu mới (*)"
                      type="password"
                      className="form-control input-form"
                      placeholder="Nhập lại mật khẩu mới"
                      errors={errors}
                    />
                  </div>
                  <div className="col-md-12 col-last-custom">
                    <div className="button-new float-right pr-0">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={this.closeModal}
                        onKeyPress={() => {}}
                      >
                        <span>Đóng </span>
                      </div>
                    </div>
                    <div className="button-new float-right">
                      <button className="btn-submit-profile" type="button">
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={this.onSubmitForm}
                          onKeyPress={() => {}}
                        >
                          <span>Đổi mật khẩu</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Popup>
      </>
    );
  }
}

FormChangePass.propTypes = {
  onClosePopup: PropTypes.func.isRequired
};

export default FormChangePass;
