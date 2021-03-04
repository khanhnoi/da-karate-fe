import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getTakenData,
  getDataByID,
  putData
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
  GET_LIST_BRANCH,
  GET_CLUB_BRANCH,
  GET_DOCUMENT_REQUEST,
  UPDATE_DOCUMENT_REQUEST,
  GET_LIST_INFO
} from '../../constants/config';
import TextEditor from '../../component/common/TextEditor';
import GroupFileCasorel from '../../component/common/GroupFileCasorel';

class EditDocument extends Component {
  constructor(props) {
    super(props);
    this.documents = [];
    this.state = {
      isLoading: true,
      status: false,
      errors: [],
      listBranch: [],
      listClub: [],
      showBranch: false,
      contentText: "",
      defaultList: [],
      data: [],
      defaultbranch: [],
      defaultClub: [],
      listDoc: []
    };
  }

  addNew = (e) => {
    e.preventDefault();
    const { contentText, showBranch, data } = this.state;
    const { user, match, history } = this.props;
    const { params } = match;
    const { id } = params;
    let formData = [];
    if (this.infoCatalogId.value == 2) {
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
            info_catalog_id: this.infoCatalogId.value,
            description: this.description.value,
            attach_files: this.documents,
            title: this.title.value,
            author: user.user.id,
            status: data.status
          };
        } else {
          formData = {
            content: contentText,
            info_catalog_id: this.infoCatalogId.value,
            description: this.description.value,
            attach_files: this.documents,
            title: this.title.value,
            author: user.user.id,
            status: data.status
          };
        }
        putData(UPDATE_DOCUMENT_REQUEST, id, formData)
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
          info_catalog_id: this.infoCatalogId.value,
          description: this.description.value,
          attach_files: this.documents,
          title: this.title.value,
          author: user.user.id,
          status: data.status
        };
      } else {
        formData = {
          content: contentText,
          info_catalog_id: this.infoCatalogId.value,
          description: this.description.value,
          attach_files: this.documents,
          title: this.title.value,
          author: user.user.id,
          status: data.status
        };
      }
      putData(UPDATE_DOCUMENT_REQUEST, id, formData)
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
    const { match } = this.props;
    const { params } = match;
    const { id } = params;
    if (id) {
      await getDataByID(GET_DOCUMENT_REQUEST, id)
        .then((res) => {
          this.setState({
            data: res.data,
            contentText: res.data.content,
            isLoading: false
          });
          if (res.data.info_catalog_id === 2) {
            this.setState({
              showBranch: true
            });
          }

          return Promise.resolve({ res });
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
    this.getList();
  };

  getList = async () => {
    const { data } = this.state;
    await getTakenData(GET_LIST_BRANCH).then((res) => {
      this.setState({
        listBranch: res.data,
        defaultbranch: res.data.find((item) => item.id === data.branch_id)
      });
    });
    await getTakenData(GET_LIST_INFO).then((res) => {
      this.setState({
        listDoc: res.data,
        defaultList: res.data.find((item) => item.id === data.info_catalog_id)
      });
    });
    await getDataByID(GET_CLUB_BRANCH, data.branch_id).then((res) => {
      this.setState({
        listClub: res.data,
        defaultClub: res.data.find((item) => item.id === data.club_id)
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
      data,
      defaultList,
      isLoading,
      defaultbranch,
      defaultClub
    } = this.state;
    const { history } = this.props;
    return isLoading ? (
      ''
    ) : (
      <>
        <div className="body-right-bottom">
          <div className="container-fluid container-shadow">
            <div className="row top-table">
              <div className="col-md-12 top-table-title">
                <p>Quản lý thông tin</p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">Chỉnh sửa bài viết</div>
            </div>
            <div className="row">
              <div className="col-md-12 form-title">
                <p>Chỉnh sửa bài viết </p>
              </div>
              <div className="col-md-6">
                <InputText
                  className="form-control input-form"
                  label="Tác giả : "
                  errors={errors}
                  type="text"
                  defaultValue={data && data.user && data.user.name}
                  disabled
                />
              </div>
              <div className="col-md-6">
                <InputText
                  className="form-control input-form"
                  label="Chức danh : "
                  errors={errors}
                  type="text"
                  defaultValue={data && data.user && data.user.position_name}
                  disabled
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Select
                  label="Loại bài viết (*):"
                  className="form-control input-form form-control-product mb-3 input-grey input-form-select"
                  name="info_catalog_id"
                  ref={(c) => {
                    this.infoCatalogId = c;
                  }}
                  errors={errors}
                  key_value="id"
                  key_label="name"
                  include_blank="Loại bài viết"
                  data={listDoc}
                  onChange={this.selectDoc}
                  defaultValue={defaultList}
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
                    defaultValue={defaultbranch}
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
                    defaultValue={defaultClub}
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
                  placeholder="Tiêu đề (*)"
                  name="title"
                  ref={(c) => {
                    this.title = c;
                  }}
                  label="Tiêu đề : "
                  errors={errors}
                  type="text"
                  defaultValue={data && data.title}
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
                  defaultValue={data && data.description}
                  type="textarea"
                />
              </div>
              <div className="col-md-12">
                <TextEditor
                  name="content"
                  label="Nội dung (*) : "
                  errors={errors}
                  data={data && data.content}
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
                  default={data && data.attach_files}
                />
              </div>
            </div>
            <div className="row justify-content-center">
              <div className=" d-flex mx-auto my-5">
                <ButtonSave
                  onClick={this.addNew}
                  text="Cập nhật "
                  className="btn btn-new ml-0"
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

EditDocument.propTypes = {
  history: PropTypes.func.isRequired,
  user: PropTypes.func.isRequired,
  match: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(EditDocument));
