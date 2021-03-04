import React, { Component } from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getTakenData,
  getDataByID,
  putData
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
  GET_ALL_BELT,
  GET_COMPETITION_REQUEST,
  UPDATE_COMPETITION
} from '../../constants/config';
import TextEditor from '../../component/common/TextEditor';
import GroupFile from '../../component/common/GroupOneFile';
import Datepicker from '../../component/common/Datepicker';
import ButtonSave from '../../component/common/ButtonSave';

class EditCompetition extends Component {
  constructor(props) {
    super(props);
    this.documents = [];
    this.state = {
      id: [],
      isLoading: true,
      status: false,
      errors: [],
      listBranch: [],
      listBelt: [],
      contextData: [],
      defaultCondition: [],
      data: [],
      beltInfo: [],
    };
  }

  addNew = (e) => {
    e.preventDefault();
    const { contextData, id, data } = this.state;
    const { user } = this.props;
    let formData = [];
    formData = {
      certificate_id: this.certificateId.value,
      title: this.title.value,
      organized_by_branch: this.branchId.value,
      address: this.address.value,
      regis_expiry_date: this.regis_expiry_date.value.split('-').reverse().join('-'),
      exam_date: this.exam_date.value.split('-').reverse().join('-'),
      par_conditions: this.par_conditions.value,
      content_notify: contextData,
      exam_overview: this.exam_overview.value,
      attach_files: this.documents,
      is_sendnotify: this.is_sendnotify.checked,
      num_expected_candidates: data && data.num_examiner,
      num_examiner: data && data.num_examiner,
      author: user.user.id
    };
    putData(UPDATE_COMPETITION, id, formData)
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
        showMessage(errs, false);
        this.setState({
          errors: errss
        });
      });
  };

  componentDidMount = async () => {
    const { match } = this.props;
    const { params } = match;
    const { id } = params;
    this.setState({ id: id })
    if (id) {
      await getDataByID(GET_COMPETITION_REQUEST, id)
        .then((res) => {
          this.setState({
            data: res.data,
            contextData: res.data.content_notify,
            isLoading: false,
            beltInfo: res.data.beltInfo,
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
        listBranch: res.data,
      });
    });
    await getTakenData(GET_ALL_BELT).then((res) => {
      this.setState({
        listBelt: res.data,
        defaultCondition: res.data.find((item) => item.id === data.par_conditions)

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

  render() {
    const formatDate2 = 'dd-MM-yyyy';
    const { status, errors, listBranch, defaultCondition, listBelt, isLoading, id, data, beltInfo } = this.state;
    const { history } = this.props;
    if (status) {
      return (
        <Redirect
          to={{
            pathname: `/active/competition/manage/${id}`
          }}
        />
      );
    }

    return isLoading ? ('') : (
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
                  <p>Cập Nhật Kỳ Thi</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Select
                    label="Loại kỳ thi (*):"
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
                    defaultValue={beltInfo}
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
                    defaultValue={data && data.title}
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
                    include_blank="Phân đường/CLB"
                    data={listBranch}
                    defaultValue={data && data.branchInfo}
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
                    label="Địa điểm tổ chức (*) : "
                    errors={errors}
                    type="text"
                    defaultValue={data && data.address}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Datepicker
                    label="Thời gian hết hạn nhận hồ sơ (*):"
                    className="form-control input-form"
                    name="regis_expiry_date"
                    ref={(c) => {
                      this.regis_expiry_date = c;
                    }}
                    errors={errors}
                    clearIcon={false}
                    format={formatDate2}
                    value={data && data.regis_expiry_date}
                  />
                </div>
                <div className="col-md-6">
                  <Datepicker
                    label="Thời gian tổ chức kỳ thi (*):"
                    className="form-control input-form"
                    name="exam_date"
                    ref={(c) => {
                      this.exam_date = c;
                    }}
                    errors={errors}
                    clearIcon={false}
                    format={formatDate2}
                    value={data && data.exam_date}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Select
                    label="Điều kiện đăng ký của võ sinh :"
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
                    defaultValue={defaultCondition}
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
                    data={data && data.content_notify}
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
                    defaultValue={data && data.exam_overview}
                  />
                </div>
                <div className="col-md-6">
                  <GroupFile
                    label="FILE ĐÍNH KÈM"
                    name="attach_files"
                    errors={errors}
                    onChange={this.onChangeDocument}
                    default={data && data.attach_files}
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
                      errors={errors}
                      defaultChecked={data && data.is_sendnotify}
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

EditCompetition.propTypes = {
  history: PropTypes.func.isRequired,
  user: PropTypes.func.isRequired,
  match: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(EditCompetition));
