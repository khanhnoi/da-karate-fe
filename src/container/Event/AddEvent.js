import React, { Component } from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  postData,
  getDataByID,
  getTakenData,
} from '../../services/base_services';
import InputText from '../../component/common/InputText';
import {
  destructServerErrors,
  destructServerMessage
} from '../../helpers/error';
import { showMessage } from '../../helpers/table';
import Select from '../../component/common/Select';
import {
  GET_LIST_BRANCH,
  ADD_EVENT,
  GET_CLUB_BRANCH,
} from '../../constants/config';
import TextEditor from '../../component/common/TextEditor';
import GroupFile from '../../component/common/GroupImage';
import Datepicker from '../../component/common/Datepicker';
import ButtonSave from '../../component/common/ButtonSave';
import TextArea from '../../component/common/TextArea'

class AddEvent extends Component {
  constructor(props) {
    super(props);
    this.documents = [];
    this.state = {
      status: false,
      errors: [],
      listBranch: [],
      listClub: [],
      contextData: [],
      listDoc: [],
      defaultType: [],
      type: [
        {
          id: 1,
          name: 'Sự kiện kín'
        },
        {
          id: 2,
          name: 'Sự kiện công khai'
        },
        {
          id: 3,
          name: 'Sự kiện ủng hộ'
        }
      ],
      type_id: 1,
      donate: []
    };
  }

  addNew = (e) => {
    e.preventDefault();
    const { contextData, type_id } = this.state;
    const { user } = this.props;
    let formData = [];
    if (type_id == 1) {
      formData = {
        title: this.title.value,
        branch_id: this.branch_id ? this.branch_id.value : null,
        club_id: this.club_id ? this.club_id.value : null,
        address: this.address.value,
        start_at: this.start_at.value.split('-').reverse().join('-'),
        detail: contextData,
        attach_files: this.documents,
        type: type_id,
        created_by: user.user.id,
        num_member: 0,
      };
    } else if (type_id == 2) {
      formData = {
        title: this.title.value,
        address: this.address.value,
        start_at: this.start_at.value.split('-').reverse().join('-'),
        detail: contextData,
        attach_files: this.documents,
        type: type_id,
        created_by: user.user.id,
        num_member: 0,
      }
    } else if (type_id == 3) {
      formData = {
        title: this.title.value,
        end_at: this.end_at.value.split('-').reverse().join('-'),
        detail: contextData,
        receiver_info: this.receiver_info.value,
        attach_files: this.documents,
        type: type_id,
        created_by: user.user.id,
        num_member: 0,
      }
    }
    postData(ADD_EVENT, formData)
      .then((res) => {
        showMessage("", true);
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

  componentDidMount = () => {
    const { location } = this.props
    const { state } = location
    const { type } = this.state
    this.setState({
      donate: state && state.donate,
      defaultType: state && state.donate ? type.find((item) => item.id === 3) : type[0],
      type_id: state && state.donate ? 3 : 1
    })
    this.getList();
  };

  getList = async () => {
    await getTakenData(GET_LIST_BRANCH).then((res) => {
      this.setState({
        listBranch: res.data
      });
    });
  };

  onChangeDocument = (data) => {
    this.documents = data;
  };

  changeEditer = (e, editor) => {
    const data = editor.getData();
    this.setState({
      contextData: data
    });
  };
  chosseBranch = async (e) => {
    const branch_id = e.target.value;
    await getDataByID(GET_CLUB_BRANCH, branch_id).then((res) => {
      this.setState({
        listClub: res.data
      });
    });
  };

  changeType = (e) => {
    this.setState({
      type_id: e.target.value
    })
  }

  render() {
    const formatDate2 = 'dd-MM-yyyy';
    const { status, errors, listBranch, listClub, type, type_id, donate, defaultType } = this.state;
    const { history } = this.props;
    if (status && donate && type_id == 3) {
      return (
        <Redirect
          to={{
            pathname: '/donate'
          }}
        />
      );
    } else
      if (status) {
        return (
          <Redirect
            to={{
              pathname: '/active/event'
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
                <p>Quản Lý Hoạt Động</p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">Sự Kiện</div>
            </div>
            <div className="content-form">
              <div className="row">
                <div className="col-md-12 content-title">
                  <p>Tạo Sự Kiện Mới</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 pr-2">
                  <Select
                    label="Loại sự kiện (*) :"
                    className="form-control input-form mb-3 input-blu"
                    name="type"
                    errors={errors}
                    key_value="id"
                    key_label="name"
                    data={type}
                    ref={(c) => { this.type = c }}
                    onChange={this.changeType}
                    defaultValue={defaultType}
                  />
                </div>
                <div className="col-md-6">
                  <InputText
                    className="form-control input-form"
                    name="title"
                    label="Tên sự kiện (*) : "
                    errors={errors}
                    type="text"
                    ref={(c) => { this.title = c }}
                    placeholder="Tên sự kiện"
                  />
                </div>
              </div>
              {type_id == 1 ?
                (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <Select
                          label="Đối tượng tham gia (*):"
                          className="form-control input-form"
                          name="branch_id"
                          errors={errors}
                          key_value="id"
                          key_label="name"
                          include_blank="Tất cả phân đường"
                          data={listBranch}
                          ref={(c) => { this.branch_id = c }}
                          onChange={this.chosseBranch}
                        />
                      </div>
                      <div className="col-md-6">
                        <Select
                          label="Câu lạc bộ"
                          className="form-control input-form"
                          name="club_id"
                          errors={errors}
                          key_value="id"
                          key_label="name"
                          include_blank="Tất cả câu lạc bộ"
                          data={listClub}
                          ref={(c) => { this.club_id = c }}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Datepicker
                          label="Thời gian tổ chức (*) :"
                          className="form-control input-form"
                          name="start_at"
                          errors={errors}
                          clearIcon={false}
                          format={formatDate2}
                          ref={(c) => {
                            this.start_at = c;
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <InputText
                          className="form-control input-form"
                          placeholder="Địa điểm tổ chức"
                          name="address"
                          label="Địa điểm tổ chức (*): "
                          errors={errors}
                          type="text"
                          ref={(c) => { this.address = c }}
                        />
                      </div>
                    </div>
                  </>
                ) : ''}
              {type_id == 2 ?
                <div className="row">
                  <div className="col-md-6">
                    <Datepicker
                      label="Thời gian tổ chức (*) :"
                      className="form-control input-form"
                      name="start_at"
                      errors={errors}
                      clearIcon={false}
                      format={formatDate2}
                      ref={(c) => {
                        this.start_at = c;
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <InputText
                      className="form-control input-form"
                      placeholder="<Đia điểm>"
                      name="address"
                      label="Địa điểm tổ chức (*): "
                      errors={errors}
                      type="text"
                      ref={(c) => { this.address = c }}
                    />
                  </div>
                </div> : ''}
              {type_id == 3 ?
                (<>
                  <div className='row'>
                    <div className="col-md-6">
                      <Datepicker
                        label="Thời gian hết hạn nhận ủng hộ (*) :"
                        className="form-control input-form"
                        name="end_at"
                        errors={errors}
                        clearIcon={false}
                        format={formatDate2}
                        ref={(c) => {
                          this.end_at = c;
                        }}
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <div className="col-md-12 custom-text">
                      <TextArea
                        className="form-control input-form text-area"
                        name="receiver_info"
                        label="Thông tin tài khoản nhận ủng hộ (*)"
                        errors={errors}
                        type="text"
                        ref={(c) => { this.receiver_info = c }}
                      />
                    </div>
                  </div>
                </>) : ''}
              <div className="row">
                <div className="col-md-12 custom-text">
                  <TextEditor
                    name="content_notify"
                    label="Nội dung sự kiện : "
                    errors={errors}
                    onChange={this.changeEditer}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <GroupFile
                    label="ẢNH ĐÍNH KÈM"
                    name="attach_files"
                    errors={errors}
                    onChange={this.onChangeDocument}
                    default={this.documents}
                  />
                </div>
              </div>
              <div className="row mt-4 justify-content-center">
                <div className="d-flex ">
                  <ButtonSave
                    onClick={this.addNew}
                    text="Tạo sự kiện"
                    className="btn btn-new"
                  />
                  <div
                    onClick={history.goBack}
                    onKeyPress={[]}
                    role="button"
                    tabIndex={0}
                  >
                    <ButtonSave
                      text="Hủy"
                      className="btn btn-cancel"
                    />
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

AddEvent.propTypes = {
  history: PropTypes.func.isRequired,
  user: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(AddEvent));
