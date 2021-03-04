/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import InputText from '../../component/common/InputText';
import InputPhone from '../../component/common/InputPhone';
import {
  postDataWithParams,
  getDataByID,
  putData,
  getTakenData
} from '../../services/base_services';
import ButtonSave from '../../component/common/ButtonSave';
import {
  destructServerErrors,
  destructServerMessage
} from '../../helpers/error';
import { showMessage } from '../../helpers/table';
import UploaderAvatarStudent from '../../component/common/UploaderAvatarStudent';
import {
  GET_LIST_CLUB,
  GET_STUDENT_INFO,
  UPDATE_STUDENT_REQUEST,
  GET_LIST_ALL_CLUB
} from '../../constants/config';
import Datepicker from '../../component/common/Datepicker';
import NavStudent from './NavStudent';
import defaultIMG from '../../assets/images/image.svg';
import Select from 'react-select';

class EditStudent extends Component {
  constructor(props) {
    super(props);
    this.documents = [];
    this.state = {
      status: false,
      isLoading: true,
      errors: [],
      idClub: 0,
      defaultClb: null,
      listClub: [],
      listClubOption: [],
      data: [],
      defaultList: []
    };
  }

  addNew = (e) => {
    e.preventDefault();
    const { match } = this.props;
    const { params } = match;
    const { id } = params;
    const formData = {
      name: this.name.value,
      club_id: this.state.idClub,
      avatar: this.avatar.value,
      address: this.address.value,
      email: this.email.value,
      phone: this.phone.value,
      birthday: this.birthday.value.split('-').reverse().join('-'),
      join_date: this.join_date.value.split('-').reverse().join('-'),
      profile: this.profile.value,
      job_detail: this.job.value
    };
    if (formData.avatar === { defaultIMG }) {
      formData.avatar = '';
    }
    putData(UPDATE_STUDENT_REQUEST, id, formData)
      .then((res) => {
        showMessage(res.data.message, true);
        this.setState({
          errors: [],
          status: true
        });
      })
      .catch((err) => {
        const errs = destructServerMessage(err);
        const errss = destructServerErrors(err);

        this.setState({
          errors: errss
        });
        if (err.response.status == 422) {
          return null;
        }
        showMessage(errs, false);
      });
  };

  componentDidMount = async () => {
    const { match } = this.props;
    const { params } = match;
    const { id } = params;

    this.getList(id);
  };

  handleChange = (newValue) => {
    this.setState({
      idClub: newValue && newValue.value
    });
  };

  getList = async (id) => {
    let { data } = this.state;
    if (id) {
      await getDataByID(GET_STUDENT_INFO, id)
        .then((res) => {
          this.setState({
            data: res.data,
            isLoading: false
          });
          return Promise.resolve({ res });
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
    await getTakenData(GET_LIST_ALL_CLUB).then((res) => {
      let { data } = this.state;
      let listClb = res.data;
      let listClbOpt = [];
      for (let i = 0; i < listClb.length; i++) {
        listClbOpt.push({
          label: listClb[i].name,
          value: listClb[i].id
        });
      }
      let findValue = res.data.find((item) => item.id === data.club_id);
      findValue = {
        label: findValue.name,
        value: findValue.id
      };
      this.setState({
        listClub: res.data,
        defaultClb: findValue,
        idClub:  findValue.value,
      });
      this.setState({
        listClubOption: listClbOpt
      });
    });
  };

  render() {
    const {
      status,
      errors,
      listClub,
      data,
      isLoading,
      defaultList,
      defaultClb,
      listClubOption
    } = this.state;
    const formatDate = 'dd-MM-yyyy';

    if (status) {
      return (
        <Redirect
          to={{
            pathname: '/statistical/student'
          }}
        />
      );
    }
    return isLoading ? (
      ''
    ) : (
      <>
        <div className="body-right-bottom">
          <div className="content">
            <NavStudent />
            <div className="container-fluid mt-5">
              <div className="content-form">
                <div className="row">
                  <div className="col-md-12 content-title">
                    <p> Chỉnh Sửa Võ Sinh</p>
                  </div>
                  <div className="col-md-4">
                    <UploaderAvatarStudent
                      ref={(c) => {
                        this.avatar = c;
                      }}
                      name="avatar"
                      errors={errors}
                      label="Chọn logo"
                      defaultValue={data && data.avatar}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-md-12 top-table-title">
                        <p>Thông tin cơ bản: </p>
                      </div>
                      <div className="col-md-6">
                        <InputText
                          className="form-control input-form"
                          placeholder="Họ và tên"
                          name="name"
                          ref={(c) => {
                            this.name = c;
                          }}
                          label="Họ và tên (*): "
                          errors={errors}
                          type="text"
                          defaultValue={data && data.name}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="input-label">
                          Đang sinh hoạt tại (*):
                        </label>

                        {defaultClb && defaultClb.label && (
                          <Select
                            className="select-custom-import"
                            name="partners"
                            onChange={this.handleChange}
                            options={listClubOption}
                            placeholder="Câu Lạc Bộ"
                            defaultValue={
                              defaultClb
                            }
                          />
                        )}
                      </div>
                      <div className="col-md-6">
                        <InputText
                          className="form-control input-form"
                          placeholder="Địa chỉ"
                          name="address"
                          ref={(c) => {
                            this.address = c;
                          }}
                          label="Địa chỉ : "
                          errors={errors}
                          type="text"
                          defaultValue={data && data.address}
                        />
                      </div>
                      <div className="col-md-6">
                        <Datepicker
                          name="join_date"
                          ref={(c) => {
                            this.join_date = c;
                          }}
                          label="Từ ngày"
                          errors={errors}
                          clearIcon={false}
                          className="form-control input-form"
                          format={formatDate}
                          defaultValue={data && data.join_date}
                        />
                      </div>
                      <div className="col-md-6">
                        <InputText
                          className="form-control input-form"
                          placeholder="Email"
                          name="email"
                          ref={(c) => {
                            this.email = c;
                          }}
                          label="Email (*): "
                          errors={errors}
                          type="text"
                          defaultValue={data && data.email}
                        />
                      </div>
                      <div className="col-md-6">
                        <InputPhone
                          className="form-control input-form"
                          placeholder="Số điện thoại"
                          name="phone"
                          ref={(c) => {
                            this.phone = c;
                          }}
                          label="Số điện thoại (*): "
                          errors={errors}
                          type="text"
                          defaultValue={data && data.phone}
                        />
                      </div>
                      <div className="col-md-6">
                        <InputText
                          className="form-control input-form"
                          placeholder="Tài khoản"
                          name="profile"
                          ref={(c) => {
                            this.profile = c;
                          }}
                          label="Tài khoản xã hội : "
                          errors={errors}
                          type="text"
                          defaultValue={data && data.profile}
                        />
                      </div>
                      <div className="col-md-6">
                        <Datepicker
                          name="birthday"
                          ref={(c) => {
                            this.birthday = c;
                          }}
                          label="Sinh nhật"
                          errors={errors}
                          clearIcon={false}
                          className="form-control input-form"
                          format={formatDate}
                          defaultValue={data && data.birthday}
                        />
                      </div>

                      <div className="col-md-6">
                        <InputText
                          className="form-control input-form"
                          placeholder="Nghề nghiệp"
                          name="job_detail"
                          ref={(c) => {
                            this.job = c;
                          }}
                          label="Nghề nghiệp : "
                          errors={errors}
                          type="text"
                          defaultValue={data && data.job_detail}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center">
                <div className="col-12 my-5">
                  <div className="form-add-buttons">
                    <ButtonSave
                      onClick={this.addNew}
                      text="Lưu thông tin"
                      className="btn btn-new ml-0"
                    />
                    <Link to="/statistical/student">
                      <ButtonSave text="Hủy" className="btn btn-cancel" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

EditStudent.propTypes = {
  match: PropTypes.func.isRequired
};

export default withRouter(EditStudent);
