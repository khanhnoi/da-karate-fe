/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  postData,
  getTakenData,
  getDataByID
} from '../../services/base_services';
import ButtonSave from '../../component/common/ButtonSave';
import InputText from '../../component/common/InputText';
import TextArea from '../../component/common/TextArea';
import {
  destructServerErrors,
  destructServerMessage
} from '../../helpers/error';
import { showMessage } from '../../helpers/table';
import Select from '../../component/common/Select';
import {
  NEW_DOCUMENT_REQUEST,
  GET_LIST_BRANCH,
  GET_CLUB_BRANCH,
  GET_LIST_INFO
} from '../../constants/config';
import TextEditor from '../../component/common/TextEditor';
import GroupFileCasorel from '../../component/common/GroupFileCasorel';

class NewDocument extends Component {
  constructor(props) {
    super(props);
    this.documents = [];
    this.state = {
      status: false,
      errors: [],
      listBranch: [],
      listClub: [],
      showBranch: false,
      contentText: "",
      listDoc: [],
      defaultList: [],
      loadList: true
    };
  }

  addNew = (e) => {
    e.preventDefault();
    const { contentText, showBranch } = this.state;
    const { user, match, history } = this.props;
    const { params } = match;
    const { id } = params;
    let formData = [];
    if (this.InfoCatalogId.value == 2) {
      if (this.branchId.value == 0) {
        this.setState({
          errors: {
            branch_id: ['Phải chọn phân đường']
          }
        });
        showMessage('Lỗi', false);
      } else {
        if (showBranch) {
          formData = {
            content: contentText,
            branch_id: this.branchId.value,
            club_id: this.clubId.value,
            info_catalog_id: this.InfoCatalogId.value,
            description: this.description.value,
            attach_files: this.documents,
            title: this.title.value,
            author: user.user.id,
            status: 1
          };
        } else {
          formData = {
            content: contentText,
            info_catalog_id: this.InfoCatalogId.value,
            description: this.description.value,
            attach_files: this.documents,
            title: this.title.value,
            author: user.user.id,
            status: 1
          };
        }
        postData(NEW_DOCUMENT_REQUEST, formData)
          .then((res) => {
            showMessage(res.data.message, true);
            this.setState({
              errors: [],
              status: true
            });
            history.goBack();
          })
          .catch((err) => {
            const errs = destructServerMessage(err);
            const errss = destructServerErrors(err);
            showMessage(errs, false);
            this.setState({
              errors: errss
            });
          });
      }
    } else {
      if (showBranch) {
        formData = {
          content: contentText,
          branch_id: this.branchId.value,
          club_id: this.clubId.value,
          info_catalog_id: this.InfoCatalogId.value,
          description: this.description.value,
          attach_files: this.documents,
          title: this.title.value,
          author: user.user.id,
          status: 1
        };
      } else {
        formData = {
          content: contentText,
          info_catalog_id: this.InfoCatalogId.value,
          description: this.description.value,
          attach_files: this.documents,
          title: this.title.value,
          author: user.user.id,
          status: 1
        };
      }
      postData(NEW_DOCUMENT_REQUEST, formData)
        .then((res) => {
          showMessage(res.data.message, true);
          this.setState({
            errors: [],
            status: true
          });
          history.goBack();
        })
        .catch((err) => {
          const errs = destructServerMessage(err);
          const errss = destructServerErrors(err);
          showMessage(errs, false);
          this.setState({
            errors: errss
          });
        });
    }
  };

  addDraft = (e) => {
    e.preventDefault();
    const { contentText, showBranch } = this.state;
    const { user, match, history } = this.props;
    const { params } = match;
    const { id } = params;
    let formData = [];
    if (this.InfoCatalogId.value == 2) {
      if (this.branchId.value == 0) {
        this.setState({
          errors: {
            branch_id: ['Phải chọn branch_id']
          }
        });
        showMessage('Lỗi', false);
      } else {
        if (showBranch) {
          formData = {
            content: contentText,
            branch_id: this.branchId.value,
            club_id: this.clubId.value,
            info_catalog_id: this.InfoCatalogId.value,
            description: this.description.value,
            attach_files: this.documents,
            title: this.title.value,
            author: user.user.id,
            status: 0
          };
        } else {
          formData = {
            content: contentText,
            info_catalog_id: this.InfoCatalogId.value,
            description: this.description.value,
            attach_files: this.documents,
            title: this.title.value,
            author: user.user.id,
            status: 0
          };
        }
        postData(NEW_DOCUMENT_REQUEST, formData)
          .then((res) => {
            showMessage(res.data.message, true);
            this.setState({
              errors: [],
              status: true
            });
            history.goBack();
          })
          .catch((err) => {
            const errs = destructServerMessage(err);
            const errss = destructServerErrors(err);
            showMessage(errs, false);
            this.setState({
              errors: errss
            });
          });
      }
    } else {
      if (showBranch) {
        formData = {
          content: contentText,
          branch_id: this.branchId.value,
          club_id: this.clubId.value,
          info_catalog_id: this.InfoCatalogId.value,
          description: this.description.value,
          attach_files: this.documents,
          title: this.title.value,
          author: user.user.id,
          status: 0
        };
      } else {
        formData = {
          content: contentText,
          info_catalog_id: this.InfoCatalogId.value,
          description: this.description.value,
          attach_files: this.documents,
          title: this.title.value,
          author: user.user.id,
          status: 0
        };
      }
      postData(NEW_DOCUMENT_REQUEST, formData)
        .then((res) => {
          showMessage(res.data.message, true);
          this.setState({
            errors: [],
            status: true
          });
          history.goBack();
        })
        .catch((err) => {
          const errs = destructServerMessage(err);
          const errss = destructServerErrors(err);
          showMessage(errs, false);
          this.setState({
            errors: errss
          });
        });
    }
  };

  componentDidMount = async () => {
    await this.getList();
  };

  getList = async () => {
    const { location } = this.props;
    const id = location && location.query && location.query.log_id;
    if (id == 2) {
      this.setState({
        showBranch: true
      });
    }
    await getTakenData(GET_LIST_BRANCH).then((res) => {
      this.setState({
        listBranch: res.data
      });
    });
    await getTakenData(GET_LIST_INFO).then((res) => {
      this.setState({
        listDoc: res.data
      });
    });
  };

  selectDoc = (e) => {
    const docId = e.target.value;
    if (docId === '2') {
      this.setState({
        showBranch: true,
        errors: []
      });
    } else {
      this.setState({
        showBranch: false,
        errors: []
      });
    }
  };

  selectBranch = async (e) => {
    const branchId = e.target.value;
    await getDataByID(GET_CLUB_BRANCH, branchId).then((res) => {
      this.setState({
        listClub: res.data
      });
    });
  };

  onChangeDocument = (data) => {
    this.documents = data;
  };

  changeEditer = (e, editor) => {
    const data = editor.getData();
    this.setState({
      contentText: data
    });
  };

  render() {
    const {
      errors,
      listClub,
      listBranch,
      showBranch,
      listDoc,
      defaultList,
      loadList
    } = this.state;
    const { history, location } = this.props;
    const id = location && location.query && location.query.log_id;

    return (
      <>
        <div className="body-right-bottom">
          <div className="container-fluid container-shadow">
            <div className="row top-table">
              <div className="col-md-12 top-table-title">
                <p>Quản lý thông tin</p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">Thêm mới bài viết</div>
            </div>
            <div className="row">
              <div className="col-md-12 form-title">
                <p>Bài viết mới</p>
              </div>
              <div className="col-md-6">
                <Select
                  label="Loại bài viết (*):"
                  className="form-control input-form form-control-product mb-3 input-grey input-form-select"
                  name="info_catalog_id"
                  ref={(c) => {
                    this.InfoCatalogId = c;
                  }}
                  errors={errors}
                  key_value="id"
                  key_label="name"
                  include_blank="Loại bài viết"
                  data={listDoc}
                  onChange={this.selectDoc}
                  defaultValue={listDoc.find((item) => item.id === id)}
                />
              </div>
            </div>
            {showBranch ? (
              <div className="row">
                <div className="col-md-6">
                  <Select
                    label="Phân đường (*):"
                    className="form-control input-form form-control-product mb-3 input-grey input-form-select"
                    name="branch_id"
                    ref={(c) => {
                      this.branchId = c;
                    }}
                    errors={errors}
                    key_value="id"
                    key_label="name"
                    include_blank="Phân đường"
                    data={listBranch}
                    onChange={this.selectBranch}
                  />
                </div>
                <div className="col-md-6">
                  <Select
                    label="Câu lạc bộ :"
                    className="form-control input-form form-control-product mb-3 input-grey input-form-select"
                    name="club_id"
                    ref={(c) => {
                      this.clubId = c;
                    }}
                    errors={errors}
                    key_value="id"
                    key_label="name"
                    include_blank="Câu lạc bộ"
                    data={listClub}
                  />
                </div>
              </div>
            ) : (
              ''
            )}
            <div className="row">
              <div className="col-md-12">
                <InputText
                  className="form-control input-form"
                  placeholder="Tiêu đề"
                  name="title"
                  ref={(c) => {
                    this.title = c;
                  }}
                  label="Tiêu đề (*) : "
                  errors={errors}
                  type="text"
                />
              </div>
              <div className="col-md-12">
                <TextArea
                  className="form-control input-form"
                  placeholder="Tóm tắt"
                  name="description"
                  ref={(c) => {
                    this.description = c;
                  }}
                  label="Tóm tắt :"
                  errors={errors}
                  type="textarea"
                />
              </div>
              <div className="col-md-12">
                <TextEditor
                  name="content"
                  label="Nội dung (*) : "
                  errors={errors}
                  onChange={this.changeEditer}
                />
              </div>
              <div className="col-md-12">
                <GroupFileCasorel
                  label="Hình ảnh/Video đính kèm"
                  name="attach_files"
                  title="Chọn ảnh để tải"
                  errors={errors}
                  onChange={this.onChangeDocument}
                  default={this.documents}
                />
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="mx-auto  my-5 d-flex flex-wrap">
                <ButtonSave
                  text="Lưu Nháp"
                  className="btn btn-ne"
                  onClick={this.addDraft}
                  className="btn btn-new "
                />
                <ButtonSave
                  onClick={this.addNew}
                  text="Đăng bài"
                  className="btn btn-new "
                />
                <div
                  onClick={history.goBack}
                  onKeyPress={[]}
                  role="button"
                  tabIndex={0}
                >
                  <ButtonSave text="Hủy" className="btn btn-cancel" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

NewDocument.propTypes = {
  history: PropTypes.func.isRequired,
  user: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(NewDocument));
