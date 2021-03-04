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
  GET_LIBRARY_REQUEST,
  UPDATE_LIBRARY_REQUEST,
  GET_LIST_CATALOG
} from '../../constants/config';
import TextEditor from '../../component/common/TextEditor';
import GroupFile from '../../component/common/GroupFileCasorel';
import GroupVideo from '../../component/common/GroupVideo';
import GroupPhoto from '../../component/common/GroupPhoto';
import GroupEbook from '../../component/common/GroupEbook';
import GroupPhotoCustom from '../../component/common/GroupPhotoCustom';
import { getFormDataFromRef } from '../../helpers/form';

class EditLibrary extends Component {
  constructor(props) {
    super(props);
    this.documents = [];
    this.state = {
      isLoading: true,
      status: false,
      errors: [],
      listBranch: [],
      listClub: [],
      contentText: '',
      defaultList: [],
      data: [],
      defaultbranch: [],
      defaultClub: [],
      listDoc: [],
      numPhoto: [
        {
          num: '',
          image: 'check'
        }
      ]
    };
  }

  addNew = (e) => {
    e.preventDefault();
    const { contextData, catalogId, numPhoto } = this.state;
    const { user, match, history } = this.props;
    const { params } = match;
    const { id } = params;
    let formData = [];
    if (catalogId == 4) {
      const dataFile = getFormDataFromRef(this.refs);
      let attach_files = [];
      numPhoto.map((item, index) => {
        if (item.image != 'check') {
          attach_files = [
            ...attach_files,
            {
              image: dataFile[`photoIndex${index}`],
              title: dataFile[`indexText${index}`]
            }
          ];
        }
      });
      formData = {
        branch_id: this.branchId.value,
        club_id: this.clubId.value,
        catalog_id: this.infoCatalogId.value,
        description: this.description.value,
        attach_files: attach_files,
        title: this.title.value,
        author: user.user.id,
        status: 1
      };
    } else {
      formData = {
        content: contextData,
        branch_id: this.branchId.value,
        club_id: this.clubId.value,
        catalog_id: this.infoCatalogId.value,
        description: this.description.value,
        attach_files: this.documents,
        title: this.title.value,
        bgr_image: this.bgr_image && this.bgr_image.value,
        author: user.user.id,
        status: 1
      };
    }
    if (catalogId == 5) {
      putData(UPDATE_LIBRARY_REQUEST, id, formData)
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
    } else {
      putData(UPDATE_LIBRARY_REQUEST, id, formData)
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
      await getDataByID(GET_LIBRARY_REQUEST, id)
        .then((res) => {
          this.setState({
            data: res.data,
            contextData: res.data.content,
            isLoading: false,
            catalogId: res.data.Catalog.id,
            numPhoto: res.data.attach_files
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
    const { data } = this.state;
    await getTakenData(GET_LIST_BRANCH).then((res) => {
      this.setState({
        listBranch: res.data,
        defaultbranch: res.data.find((item) => item.id === data.branch_id)
      });
    });
    await getTakenData(GET_LIST_CATALOG).then((res) => {
      this.setState({
        listDoc: res.data,
        defaultList: res.data.find((item) => item.id === data.catalog_id)
      });
    });
    await getDataByID(GET_CLUB_BRANCH, data.branch_id).then((res) => {
      this.setState({
        listClub: res.data,
        defaultClub: res.data.find((item) => item.id === data.club_id)
      });
    });
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
      contextData: data
    });
  };

  selectDoc = (e) => {
    this.setState({
      catalogId: e.target.value,
      contextData: '',
      documents: [],
      numPhoto: [
        {
          total: 0,
          image: 'check'
        }
      ],
      errors: []
    });
  };

  addPhoto = () => {
    const { numPhoto } = this.state;
    const count = numPhoto[numPhoto.length - 1].total;
    const temp = {
      total: count + 1,
      image: 'check'
    };
    this.setState({
      numPhoto: [...numPhoto, temp]
    });
  };

  addImage = (id, img) => {
    const { numPhoto } = this.state;
    const temp = numPhoto;
    temp[id].image = img;
    this.setState({
      numPhoto: temp
    });
  };

  deletePhoto = (e, id) => {
    e.preventDefault();
    const { numPhoto } = this.state;
    if (numPhoto.length != 1) {
      const temp = numPhoto;
      temp.map((item, index) => {
        if (temp.length - 1 > index && index >= id) {
          document.querySelector(`#img-${index}`).src = document.querySelector(
            `#img-${index + 1}`
          ).src;
          document.querySelector(
            `#div-${index}`
          ).className = document.querySelector(`#div-${index + 1}`).className;
        }
      });

      temp.splice(-1, 1);
      this.setState({
        numPhoto: temp
      });

      return temp;
    } else {
      return showMessage('Không được xóa hết ảnh', false);
    }
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
      defaultClub,
      catalogId,
      numPhoto
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
                <p>Quản lý tư liệu</p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">Chỉnh sửa tư liệu </div>
            </div>
            <div className="row">
              <div className="col-md-12 form-title">
                <p> Chỉnh sửa tư liệu </p>
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
                  label="Loại tư liệu (*):"
                  className="form-control input-form form-control-product mb-3 input-grey"
                  name="catalog_id"
                  ref={(c) => {
                    this.infoCatalogId = c;
                  }}
                  errors={errors}
                  key_value="id"
                  key_label="name"
                  include_blank="Loại tư liệu"
                  data={listDoc}
                  onChange={this.selectDoc}
                  defaultValue={data && data.Catalog}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Select
                  label="Phân đường :"
                  className="form-control input-form form-control-product mb-3 input-grey"
                  name="branch_id"
                  ref={(c) => {
                    this.branchId = c;
                  }}
                  errors={errors}
                  key_value="id"
                  key_label="name"
                  include_blank="Tất cả phân đường"
                  data={listBranch}
                  onChange={this.selectBranch}
                  defaultValue={defaultbranch}
                />
              </div>
              <div className="col-md-6">
                <Select
                  label="Câu lạc bộ :"
                  className="form-control input-form form-control-product mb-3 input-grey"
                  name="club_id"
                  ref={(c) => {
                    this.clubId = c;
                  }}
                  errors={errors}
                  key_value="id"
                  key_label="name"
                  include_blank="Tất cả câu lạc bộ"
                  data={listClub}
                  defaultValue={defaultClub}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <InputText
                  className="form-control input-form"
                  placeholder="Tiêu đề"
                  name="title"
                  ref={(c) => {
                    this.title = c;
                  }}
                  label="Tiêu đề (*): "
                  errors={errors}
                  type="text"
                  defaultValue={data && data.title}
                />
              </div>
              {catalogId == 5 ? (
                <>
                  <div className="col-md-12">
                    <TextEditor
                      name="content"
                      label="Nội dung(*) : "
                      errors={errors}
                      data={data && data.content}
                      onChange={this.changeEditer}
                    />
                  </div>
                  <div className="col-md-6">
                    <TextArea
                      className="form-control input-form custom-text-area"
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
                    <GroupFile
                      label="FILE ĐÌNH KÈM"
                      name="attach_files"
                      title="Chọn ảnh để tải"
                      errors={errors}
                      onChange={this.onChangeDocument}
                      default={data && data.attach_files}
                    />
                  </div>
                </>
              ) : catalogId == 1 || catalogId == 2 ? (
                <>
                  <div className="col-md-6">
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
                  <div className="col-md-6">
                    <GroupVideo
                      label="VIDEO ĐÌNH KÈM"
                      name="attach_files"
                      title="Chọn ảnh để tải"
                      errors={errors}
                      onChange={this.onChangeDocument}
                      default={data && data.attach_files}
                    />
                  </div>
                </>
              ) : catalogId == 4 ? (
                <>
                  <div className="col-md-12 d-flex flex-wrap pb-3">
                    <label className="input-label">ẢNH ĐÌNH KÈM (*)</label>
                    <ButtonSave
                      text="Thêm ảnh"
                      className="button-new ml-auto mr-0"
                      onClick={this.addPhoto}
                    />
                  </div>
                  {numPhoto.map((item, index) => (
                    <>
                      <div className="col-md-6 position-relative" key={index}>
                        <GroupPhotoCustom
                          name={`photoIndex${index}`}
                          ref={`photoIndex${index}`}
                          title="Chọn ảnh để tải"
                          errors={errors}
                          addImage={this.addImage}
                          order={index}
                          defaultValue={item.image == 'check' ? '' : item.image}
                        />
                        <form className="d-flex fex-wrap" id={`form-${index}`}>
                          <div className="col-md-10">
                            <InputText
                              className="form-control input-form"
                              placeholder="< Nội dung ảnh >"
                              errors={errors}
                              type="text"
                              ref={`indexText${index}`}
                            />
                          </div>
                          <div className="col-md-2">
                            <ButtonSave
                              text="X"
                              className="button-new button-new-close ml-auto mr-0"
                              onClick={(e) => this.deletePhoto(e, index)}
                            />
                          </div>
                        </form>
                      </div>
                    </>
                  ))}

                  <div className="col-md-12">
                    <TextArea
                      className="form-control w-50 input-form"
                      placeholder="Tóm tắt"
                      name="description"
                      ref={(c) => {
                        this.description = c;
                      }}
                      label="Tóm tắt :"
                      errors={errors}
                      type="textarea"
                      defaultValue={data && data.description}
                    />
                  </div>
                </>
              ) : catalogId == 3 ? (
                <>
                  <div className="col-md-6">
                    <GroupEbook
                      label="Nội dung (*)"
                      name="attach_files"
                      title="Chọn ảnh để tải"
                      errors={errors}
                      onChange={this.onChangeDocument}
                      default={this.documents}
                      default={data && data.attach_files}
                    />
                  </div>
                  <div className="col-md-6">
                    <GroupPhoto
                      label="Ảnh bìa"
                      name="bgr_image"
                      ref={(c) => {
                        this.bgr_image = c;
                      }}
                      title="Chọn ảnh để tải"
                      errors={errors}
                      order={2}
                      defaultValue={data && data.bgr_image}
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
                      defaultValue={data && data.description}
                    />
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
            <div className="row justify-content-center">
              <div className=" d-flex mx-auto my-5">
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

EditLibrary.propTypes = {
  history: PropTypes.func.isRequired,
  user: PropTypes.func.isRequired,
  match: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(EditLibrary));
