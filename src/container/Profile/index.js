import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import InputText from '../../component/common/InputText';
import Datepicker from '../../component/common/Datepicker';
import { updateUserProfileRequest, resetState } from '../../actions/index';
import InputPhone from '../../component/common/InputPhone';
import UploaderAvatar from '../../component/common/UploaderAvatar';
import FormChangePass from './FormChangePass';
import ButtonSave from '../../component/common/ButtonSave';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowFormChangePass: false
    };
  }

  onSubmitForm = (e) => {
    e.preventDefault();
    const { updateUserProfile } = this.props;
    const data = {
      name: this.name.value,
      avatar: this.avatar.value,
      address: this.address.value,
      email: this.email.value,
      phone: this.phone.value,
      birthday: this.birthday.value.split('-').reverse().join('-')
    };
    updateUserProfile(data);
  };

  showFormChangePass = () => {
    this.setState({
      isShowFormChangePass: true
    });
  };

  onClosePopup = () => {
    this.setState({
      isShowFormChangePass: false
    });
  };

  componentWillUnmount() {
    this.props.resetState()
  }

  render() {
    const { isShowFormChangePass } = this.state;
    const {
      user: { user, errors }
    } = this.props;
    const formatDate = 'dd-MM-yyyy';

    return (
      <>
        <div className="body-right-bottom">
          <div className="container-fluid content">
            <div className="row top-table">
              <div className="col-md-12 top-table-title">
                <p>Quản Lý Tài Khoản</p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">
                {user && user.name}
              </div>
            </div>
            <div className="content-form">
              <form onSubmit={this.onSubmitForm}>
                <div className="row">
                  <div className="col-md-12 content-title">
                    <p>Hồ Sơ Cá Nhân</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <UploaderAvatar
                      ref={(c) => {
                        this.avatar = c;
                      }}
                      name="avatar"
                      errors={errors}
                      label="Chọn ảnh cá nhân"
                      defaultValue={user && user.avatar}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <InputText
                      className="form-control input-form"
                      placeholder="Họ và tên"
                      name="name"
                      ref={(c) => {
                        this.name = c;
                      }}
                      label="Họ và tên(*)"
                      errors={errors}
                      type="text"
                      defaultValue={user && user.name}
                    />
                  </div>
                  <div className="col-md-6">
                    <InputPhone
                      name="phone"
                      ref={(c) => {
                        this.phone = c;
                      }}
                      label="Số điện thoại(*)"
                      type="text"
                      className="form-control input-form"
                      placeholder="Số điện thoại"
                      errors={errors}
                      defaultValue={user && user.phone}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <InputText
                      className="form-control input-form"
                      placeholder="Email"
                      name="email"
                      ref={(c) => {
                        this.email = c;
                      }}
                      label="Email(*)"
                      errors={errors}
                      type="text"
                      defaultValue={user && user.email}
                    />
                  </div>
                  <div className="col-md-6">
                    <InputText
                      className="form-control input-form"
                      placeholder="Địa chỉ"
                      name="address"
                      ref={(c) => {
                        this.address = c;
                      }}
                      label="Địa chỉ"
                      errors={errors}
                      type="text"
                      defaultValue={user && user.address}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <Datepicker
                      name="birthday"
                      ref={(c) => {
                        this.birthday = c;
                      }}
                      label="Ngày sinh"
                      errors={errors}
                      clearIcon={false}
                      className="form-control input-form"
                      defaultValue={user && user.birthday}
                      format={formatDate}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 my-5">
                    <div className="form-add-buttons">
                      <ButtonSave
                        tabIndex={0}
                        onClick={this.onSubmitForm}
                        text="Lưu thông tin"
                        className="btn btn-new"
                        onKeyPress={() => {}}
                      />
                      <div
                        role="button"
                        tabIndex={0}
                        className="block-button-custom"
                        onClick={this.showFormChangePass}
                        onKeyPress={() => {}}
                      >
                        <a
                          className="btn btn-new"
                        >
                          <span>Đổi mật khẩu</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div>
              {isShowFormChangePass && (
                <FormChangePass onClosePopup={this.onClosePopup} />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

Profile.propTypes = {
  updateUserProfile: PropTypes.func.isRequired,
  user: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserProfile: (data) => {
      dispatch(updateUserProfileRequest(data));
    },
    resetState: () => {
      dispatch(resetState());
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Profile));
