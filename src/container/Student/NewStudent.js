import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import InputText from '../../component/common/InputText';
import InputPhone from '../../component/common/InputPhone';
import {
  postDataWithParams,
  postData,
  getTakenData
} from '../../services/base_services';
import ButtonSave from '../../component/common/ButtonSave';
import {
  destructServerErrors,
  destructServerMessage
} from '../../helpers/error';
import { showMessage } from '../../helpers/table';
import UploaderAvatarStudent from '../../component/common/UploaderAvatarStudent';
import Select from 'react-select'

import {
  NEW_STUDENT_REQUEST,
  GET_LIST_CLUB,
  GET_LIST_ALL_CLUB
} from '../../constants/config';
import Datepicker from '../../component/common/Datepicker';
import defaultIMG from '../../assets/images/image.svg';
import { formatDate } from '../../helpers/form';


class NewStudent extends Component {
  constructor(props) {
    super(props);
    this.documents = [];
    this.state = {
      status: false,
      errors: [],
      idClub: 0,
      listClub: [],
      listClubOption: []
    };
  }

  addNew = (e) => {
    e.preventDefault();
    const formData = {
      name: this.name.value,
      club_id: this.state.idClub,
      avatar: this.avatar.value,
      address: this.address.value,
      email: this.email.value,
      phone: this.phone.value,
      birthday:
        this.birthday.value === ''
          ? formatDate(new Date()).split('-').reverse().join('-')
          : this.birthday.value.split('-').reverse().join('-'),
      join_date:
        this.join_date.value === ''
          ? formatDate(new Date()).split('-').reverse().join('-')
          : this.join_date.value.split('-').reverse().join('-'),
      profile: this.profile.value,
      job_detail: this.job.value
    };
    if (formData.avatar === { defaultIMG }) {
      formData.avatar = '';
    }
    postData(NEW_STUDENT_REQUEST, formData)
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

  handleChange = (newValue) => {
    this.setState({
      idClub: newValue && newValue.value,
    })
  }

  componentDidMount = () => {
    this.getList();
  };

  getList = async () => {
    await getTakenData(GET_LIST_ALL_CLUB).then((res) => {
      let listClb = res.data
      let listClbOpt = [];
      for (let i = 0; i < listClb.length; i++) {
        listClbOpt.push(
                {
                  label: listClb[i].name,
                  value: listClb[i].id
                }
              )
      }
      this.setState({
        listClub: listClb
      });
      this.setState({
        listClubOption: listClbOpt
      });
    });
  };

  render() {
    const { status, errors, listClub, listClubOption } = this.state;
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
    return (
      <>
        <div className="body-right-bottom">
          <div className="container-fluid content">
            <div className="row top-table">
              <div className="col-md-12 top-table-title">
                <p>Quản Lý Võ Sinh </p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">Thêm Mới Võ Sinh </div>
            </div>
            <div className="content-form">
              <div className="row">
                <div className="col-md-12 content-title">
                  <p> Thêm Mới Võ Sinh</p>
                </div>
                <div className="col-md-4">
                  <UploaderAvatarStudent
                    ref={(c) => {
                      this.avatar = c;
                    }}
                    name="avatar"
                    errors={errors}
                    label="Chọn logo"
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
                      />
                    </div>
                    <div className="col-md-6">
        
                      <label className="input-label">Đang sinh hoạt tại (*):</label>
                      <Select
                        className="select-custom-import"
                        name="partners"
                        onChange={this.handleChange}
                        options={listClubOption}                        
                        placeholder="Câu Lạc Bộ"
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
                        label="Địa chỉ : "
                        errors={errors}
                        type="text"
                      />
                    </div>
                    <div className="col-md-6">
                      <Datepicker
                        name="join_date"
                        ref={(c) => {
                          // eslint-disable-next-line camelcase
                          this.join_date = c;
                        }}
                        label="Từ ngày"
                        defaultValue={null}
                        errors={errors}
                        clearIcon={false}
                        className="form-control input-form"
                        format={formatDate}
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
                      />
                    </div>
                    <div className="col-md-6">
                      <Datepicker
                        name="birthday"
                        ref={(c) => {
                          this.birthday = c;
                        }}
                        label="Sinh nhật"
                        defaultValue={null}
                        errors={errors}
                        clearIcon={false}
                        className="form-control input-form"
                        format={formatDate}
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
                      />
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

export default NewStudent;
