import React, { Component } from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  postData,
  getTakenData,
  getDataByID
} from '../../services/base_services';
import InputText from '../../component/common/InputText';
import TextArea from '../../component/common/TextArea';
import {
  destructServerErrors,
  destructServerMessage
} from '../../helpers/error';
import { showMessage } from '../../helpers/table';
import Select from '../../component/common/Select';
import {
  GET_LIST_BRANCH,
  ADD_COMPETITION,
  GET_ALL_BELT,
  GET_CLUB_BRANCH
} from '../../constants/config';
import TextEditor from '../../component/common/TextEditor';
import GroupFile from '../../component/common/GroupOneFile';
import Datepicker from '../../component/common/Datepicker';
import ButtonSave from '../../component/common/ButtonSave';

class AddCompetition extends Component {
  constructor(props) {
    super(props);
    this.documents = [];
    this.state = {
      status: false,
      errors: [],
      listBranch: [],
      listBelt: [],
      contextData: [],
      listDoc: [],
      listClub: [],
    };
  }

  addNew = (e) => {
    e.preventDefault();
    const { contextData } = this.state;
    const { user } = this.props;
    let formData = [];
    formData = {
      certificate_id: this.certificateId.value,
      title: this.title.value,
      organized_by_branch: this.branchId.value,
      organized_by_club: this.organized_by_club ? this.organized_by_club.value : null,
      address: this.address.value,
      regis_expiry_date: this.regis_expiry_date.value.split('-').reverse().join('-'),
      exam_date: this.exam_date.value.split('-').reverse().join('-'),
      par_conditions: this.par_conditions.value,
      content_notify: contextData,
      exam_overview: this.exam_overview.value,
      attach_files: this.documents,
      is_sendnotify: this.is_sendnotify.checked,
      num_member_regis: 50,
      num_examiner: 0,
      created_by: user.user.id
    };
    postData(ADD_COMPETITION, formData)
      .then((res) => {
        showMessage("Thêm mới thành công", true);
        this.setState({
          errors: [],
          status: true
        });
      })
      .catch((err) => {
        const errs = destructServerMessage(err);
        const errss = destructServerErrors(err);
        showMessage(errs, false);
        this.setState({
          errors: errss
        });
      });
  };

  componentDidMount = () => {
    this.getList();
  };

  getList = async () => {
    await getTakenData(GET_LIST_BRANCH).then((res) => {
      this.setState({
        listBranch: res.data
      });
    });
    await getTakenData(GET_ALL_BELT).then((res) => {
      this.setState({
        listBelt: res.data
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

  render() {
    const formatDate2 = 'dd-MM-yyyy';
    const { status, errors, listBranch, listBelt, listClub } = this.state;
    const { history } = this.props;
    if (status) {
      return (
        <Redirect
          to={{
            pathname: '/active/competition'
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
              <div className="col-md-12 top-table-text">Kỳ Thi</div>
            </div>
            <div className="content-form">
              <div className="row">
                <div className="col-md-12 content-title">
                  <p>Tạo Kỳ Thi Mới</p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Select
                    label="Loại kỳ thi (*) :"
                    className="form-control input-form mb-3 input-blu"
                    name="certificate_id"
                    ref={(c) => {
                      this.certificateId = c;
                    }}
                    errors={errors}
                    key_value="id"
                    key_label="name"
                    include_blank="Loại kỳ thi"
                    data={listBelt}
                  />
                </div>
                <div className="col-md-6">
                  <InputText
                    className="form-control input-form"
                    placeholder="Tiêu đề"
                    name="title"
                    ref={(c) => {
                      this.title = c;
                    }}
                    label="Tên kỳ thi (*) : "
                    errors={errors}
                    type="text"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Select
                    label="Phân đường:"
                    className="form-control input-form"
                    name="organized_by"
                    ref={(c) => {
                      this.branchId = c;
                    }}
                    errors={errors}
                    key_value="id"
                    key_label="name"
                    include_blank="Tất cả phân đường"
                    data={listBranch}
                    onChange={this.chosseBranch}
                  />
                </div>
                <div className="col-md-6">
                  <Select
                    label="Câu lạc bộ:"
                    className="form-control input-form"
                    name="organized_by_club"
                    errors={errors}
                    key_value="id"
                    key_label="name"
                    include_blank="Tất cả câu lạc bộ"
                    data={listClub}
                    ref={(c) => { this.organized_by_club = c }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Datepicker
                    label="Thời gian hết hạn nhận hồ sơ (*) :"
                    className="form-control input-form"
                    name="regis_expiry_date"
                    ref={(c) => {
                      this.regis_expiry_date = c;
                    }}
                    errors={errors}
                    clearIcon={false}
                    format={formatDate2}
                  />
                </div>
                <div className="col-md-6">
                  <Datepicker
                    label="Thời gian tổ chức kỳ thi (*) :"
                    className="form-control input-form"
                    name="exam_date"
                    ref={(c) => {
                      this.exam_date = c;
                    }}
                    errors={errors}
                    clearIcon={false}
                    format={formatDate2}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Select
                    label="Điều kiện đăng ký của võ sinh (*):"
                    className="form-control input-form input-blu"
                    name="par_conditions"
                    ref={(c) => {
                      this.par_conditions = c;
                    }}
                    errors={errors}
                    key_value="id"
                    key_label="name"
                    include_blank="Điều kiện thi"
                    data={listBelt}
                  />
                </div>
                <div className="col-md-6">
                  <InputText
                    className="form-control input-form"
                    placeholder="Địa điểm"
                    name="address"
                    ref={(c) => {
                      this.address = c;
                    }}
                    label="Địa điểm tổ chức (*): "
                    errors={errors}
                    type="text"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <TextEditor
                    name="content_notify"
                    label="Nội dung : "
                    errors={errors}
                    onChange={this.changeEditer}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 custom-textarea">
                  <TextArea
                    className="form-control input-form"
                    placeholder="Tóm tắt"
                    name="exam_overview"
                    ref={(c) => {
                      this.exam_overview = c;
                    }}
                    label="Tóm tắt :"
                    errors={errors}
                    type="textarea"
                  />
                </div>
                <div className="col-md-6">
                  <GroupFile
                    label="FILE ĐÍNH KÈM"
                    name="attach_files"
                    title="Chọn ảnh để tải"
                    errors={errors}
                    onChange={this.onChangeDocument}
                    default={this.documents}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="form-check">
                  <label className="label" htmlFor="gridCheck">
                    <input
                      className="form-checks-input"
                      type="checkbox"
                      id="gridCheck"
                      ref={(c) => {
                        this.is_sendnotify = c;
                      }}
                    />
                    <span className="check-box">
                      Gửi thông báo đến cho các võ sinh tham gia
                  </span>
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="form-add-buttons">
                    <ButtonSave
                      onClick={this.addNew}
                      text="Lưu thông tin"
                      className="btn btn-new ml-0"
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
        </div>
      </>
    );
  }
}

AddCompetition.propTypes = {
  history: PropTypes.func.isRequired,
  user: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(AddCompetition));
