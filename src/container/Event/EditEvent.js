import React, { Component } from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  putData,
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
  UPDATE_EVENT,
  GET_CLUB_BRANCH,
  GET_EVENT
} from '../../constants/config';
import TextEditor from '../../component/common/TextEditor';
import GroupFile from '../../component/common/GroupImage';
import Datepicker from '../../component/common/Datepicker';
import TextArea from '../../component/common/TextArea';
import ButtonSave from '../../component/common/ButtonSave';

class EditEvent extends Component {
  constructor(props) {
    super(props);
    this.documents = [];
    this.state = {
      isLoading: true,
      status: false,
      data: [],
      errors: [],
      listBranch: [],
      defaultBranch: [],
      listClub: [],
      defaultClub: [],
      contextData: [],
      listDoc: [],
      id: [],
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
      defaultType: [],
      type_id: 1,
      donate: false
    };
  }
  getDate = (str) => {
    let arr = str.split('/')
    let st = arr[0];
    arr[0] = arr[1];
    arr[1] = st;
    return arr.join('/')
  }
  addNew = (e) => {
    e.preventDefault();
    const { contextData, id, type_id, data } = this.state;
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
        type: this.type.value,
        created_by: user.user.id,
        num_member: data && data.num_member,
      };
    } else if (type_id == 2) {
      formData = {
        title: this.title.value,
        address: this.address.value,
        start_at: this.start_at.value.split('-').reverse().join('-'),
        detail: contextData,
        attach_files: this.documents,
        type: this.type.value,
        created_by: user.user.id,
        num_member: data && data.num_member,
      }
    } else if (type_id == 3) {
      formData = {
        title: this.title.value,
        end_at: this.end_at.value.split('-').reverse().join('-'),
        detail: contextData,
        receiver_info: this.receiver_info.value,
        attach_files: this.documents,
        type: this.type.value,
        created_by: user.user.id,
        num_member: data && data.num_member,
      }
    }
    putData(UPDATE_EVENT, id, formData)
      .then((res) => {
        showMessage("Cập nhật thành công", true);
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
    const { match, location } = this.props;
    const { params } = match;
    const { id } = params;
    const { state } = location;
    const { type } = this.state;
    this.setState({ id: id, donate: state && state.donate })
    if (id) {
      await getDataByID(GET_EVENT, id)
        .then((res) => {
          this.setState({
            data: res.data,
            contextData: res.data.detail,
            isLoading: false,
            defaultBranch: res.data.branchInfo,
            defaultClub: res.data.clubInfo,
            type_id: res.data.type,
            defaultType: type.find((item) => item.id === res.data.type)
          });
          return Promise.resolve({ res });
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
    this.getList();
  };

  getList = async () => {
    const { data } = this.state
    await getTakenData(GET_LIST_BRANCH).then((res) => {
      this.setState({
        listBranch: res.data
      });
    });
    if (data && data.branch_id) {
      await getDataByID(GET_CLUB_BRANCH, data.branch_id).then((res) => {
        this.setState({
          listClub: res.data,
        });
      });
    }
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
    const { status, donate, errors, listBranch, listClub, id, type, type_id, data, defaultClub, defaultBranch, defaultType, isLoading } = this.state;
    const { history } = this.props;
    if (status && type_id == 3) {
      return (
        <Redirect
          to={{
            pathname: `/active/event`
          }}
        />
      );
    } else
      if (status) {
        return (
          <Redirect
            to={{
              pathname: `/active/event/detail/${id}`
            }}
          />
        );
      }
    return isLoading ? '' : (
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
                  <p>Cập Nhật Sự Kiện</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Select
                    label="Loại sự kiện :"
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
                    defaultValue={data && data.title}
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
                          defaultValue={defaultBranch}
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
                          defaultValue={defaultClub}
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
                          value={this.getDate(data && data.start_at)}
                        />
                      </div>
                      <div className="col-md-6">
                        <InputText
                          className="form-control input-form"
                          placeholder="Địa điểm"
                          name="address"
                          label="Địa điểm tổ chức: "
                          errors={errors}
                          type="text"
                          ref={(c) => { this.address = c }}
                          defaultValue={data && data.address}
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
                      value={this.getDate(data && data.start_at)}
                    />
                  </div>
                  <div className="col-md-6">
                    <InputText
                      className="form-control input-form"
                      placeholder="<Đia điểm>"
                      name="address"
                      label="Địa điểm tổ chức: "
                      errors={errors}
                      type="text"
                      ref={(c) => { this.address = c }}
                      defaultValue={data && data.address}
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
                        value={this.getDate(data && data.end_at)}
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
                        type="textarea"
                        ref={(c) => { this.receiver_info = c }}
                        defaultValue={data && data.receiver_info}
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
                    data={data && data.detail}
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
                    default={data && data.attach_files}
                  />
                </div>
              </div>
              <div className="row mt-4 justify-content-center">
                <div className="d-flex ">
                  <ButtonSave
                    onClick={this.addNew}
                    text="Cập nhật"
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

EditEvent.propTypes = {
  history: PropTypes.func.isRequired,
  user: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(EditEvent));
