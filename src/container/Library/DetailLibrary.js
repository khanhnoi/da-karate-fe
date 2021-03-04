import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FileIcon, defaultStyles } from 'react-file-icon';
import PropTypes from 'prop-types';
import {
  getDataByID,
  postData,
  postDataWithIDParams,
  deleteById
} from '../../services/base_services';
import ButtonSave from '../../component/common/ButtonSave';
import {
  GET_LIBRARY_REQUEST,
  BASE_IMG,
  GET_COMMENT_REQUEST,
  NEW_COMMENT_REQUEST,
  DELETE_COMMENT_REQUEST
} from '../../constants/config';
import inputIcon from '../../assets/images/input.svg';
import { formatDate } from '../../helpers/form';
import { confirmDelete, showMessage } from '../../helpers/table';
import eye from '../../assets/images/eye.svg';
import commentImg from '../../assets/images/speech-bubble.png';

class DetailLibrary extends Component {
  constructor(props) {
    super(props);
    this.documents = [];
    this.state = {
      isLoading: true,
      data: [],
      comment: [],
      commentLoading: true,
      isRep: false,
      idRep: null,
      contentRep: '',
      seeAll: false,
      listRep: [],
      catalogId: 0
    };
  }

  getImage = (array) => {
    let result = [];
    array.map((item) => {
      if (
        (item && item.split('.').splice(-1, 1)[0].toLowerCase() === 'png') ||
        item.split('.').splice(-1, 1)[0].toLowerCase() === 'jpg' ||
        item.split('.').splice(-1, 1)[0].toLowerCase() === 'jpeg' ||
        item.split('.').splice(-1, 1)[0].toLowerCase() === 'gif'
      ) {
        result = [...result, item];
      }
      return '';
    });
    return result;
  };

  getVIdeo = (array) => {
    let result = [];
    array.map((item) => {
      if (
        (item && item.split('.').splice(-1, 1)[0].toLowerCase() === 'avi') ||
        item.split('.').splice(-1, 1)[0].toLowerCase() === 'flv' ||
        item.split('.').splice(-1, 1)[0].toLowerCase() === 'wmv' ||
        item.split('.').splice(-1, 1)[0].toLowerCase() === 'mov' ||
        item.split('.').splice(-1, 1)[0].toLowerCase() === 'mp4'
      ) {
        result = [...result, item];
      }
      return '';
    });
    return result;
  };

  getFiles = (array) => {
    let result = [];
    array.map((item) => {
      if (
        item &&
        item.split('.').splice(-1, 1)[0].toLowerCase() !== 'avi' &&
        item.split('.').splice(-1, 1)[0].toLowerCase() !== 'flv' &&
        item.split('.').splice(-1, 1)[0].toLowerCase() !== 'wmv' &&
        item.split('.').splice(-1, 1)[0].toLowerCase() !== 'mov' &&
        item.split('.').splice(-1, 1)[0].toLowerCase() !== 'mp4' &&
        item.split('.').splice(-1, 1)[0].toLowerCase() !== 'png' &&
        item.split('.').splice(-1, 1)[0].toLowerCase() !== 'jpg' &&
        item.split('.').splice(-1, 1)[0].toLowerCase() !== 'jpeg' &&
        item.split('.').splice(-1, 1)[0].toLowerCase() !== 'gif'
      ) {
        result = [...result, item];
      }
      return '';
    });
    return result;
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
            isLoading: false,
            catalogId: res.data.Catalog.id
          });
          return Promise.resolve({ res });
        })
        .catch((error) => {
          return Promise.reject(error);
        });
      this.getComment();
    }
  };

  getComment = async () => {
    const { match } = this.props;
    const { params } = match;
    const { id } = params;
    if (id) {
      await postDataWithIDParams(GET_COMMENT_REQUEST, id, { type: 1 })
        .then((res) => {
          this.setState({
            comment: res.data,
            commentLoading: false
          });
          return Promise.resolve({ res });
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
  };

  destroyRep = () => {
    this.setState({
      isRep: false,
      contentRep: '',
      idRep: ''
    });
  };

  deleteComment = (id) => {
    confirmDelete().then((res) => {
      if (res.value === true) {
        this.removeCmtRequest(id);
      }
    });
  };

  removeCmtRequest = (id) => {
    deleteById(DELETE_COMMENT_REQUEST, id)
      .then((res) => {
        showMessage(res.data.message, true);
        this.getComment();
      })
      .catch(() => {
        showMessage('CÓ LỖI XẢY RA!', false);
      });
  };

  getRep = (id, content) => {
    this.setState({
      isRep: true,
      contentRep: content,
      idRep: id
    });
    window.scrollTo(0, document.body.scrollHeight);
  };

  repComment = (e) => {
    e.preventDefault();
    const { match, user } = this.props;
    const { params } = match;
    const { id } = params;
    const { idRep, listRep } = this.state;
    const formData = {
      post_id: id,
      content: this.content.value,
      user_id: user.user.id,
      parent_id: idRep,
      type: 1
    };
    postData(NEW_COMMENT_REQUEST, formData)
      .then(() => {
        document.querySelector('#form-input').reset();
        this.getComment();
        this.destroyRep();
        this.setState({
          listRep: [...listRep, idRep]
        });
      })
      .catch(() => {});
  };

  goEdit = () => {
    const { match, history } = this.props;
    const { params } = match;
    const { id } = params;
    history.push(`/libraries/edit/${id}`);
  };

  confirmComment = (e) => {
    e.preventDefault();
    const { match, user } = this.props;
    const { params } = match;
    const { id } = params;
    const formData = {
      post_id: id,
      content: this.content.value,
      user_id: user.user.id,
      type: 1
    };
    postData(NEW_COMMENT_REQUEST, formData)
      .then(() => {
        document.querySelector('#form-input').reset();
        this.getComment();
        this.setState({
          seeAll: true
        });
      })
      .catch(() => {});
  };

  seeAllProduct = () => {
    this.setState({
      seeAll: true
    });
  };

  render() {
    const {
      data,
      isLoading,

      catalogId
    } = this.state;
    const { history, user } = this.props;
    return isLoading ? (
      ''
    ) : (
      <>
        <div className="body-right-bottom">
          <div className="container-fluid container-shadow document-detail">
            <div className="row top-table">
              <div className="col-md-12 top-table-title">
                <p>Quản lý tư liệu </p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">Chi tiết tư liệu </div>
            </div>
            <div className="row mb-4">
              <div className="button-new button-new-red  mr-3">
                <span>{data && data.Catalog && data.Catalog.name}</span>
              </div>
              <ButtonSave
                text="Chỉnh sửa"
                onClick={this.goEdit}
                className="btn btn-new ml-auto"
              />
              <div
                onClick={history.goBack}
                onKeyPress={[]}
                role="button"
                tabIndex={0}
              >
                <ButtonSave
                  text="Quay lại"
                  className="btn btn-cancel ml-auto"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 document-detail-title">
                <p>{data && data.title}</p>
              </div>
              <div className="col-md-12 document-detail-author">
                <p>
                  {`Tác giả : ${
                    data && data.user && data.user.name
                  } - Đăng lúc : ${
                    data && data.updated_at && formatDate(data.updated_at)
                  }`}
                  <span>|</span>
                  <img src={eye} alt="" />
                  {data && data.total_react}
                  <img src={commentImg} alt="" />
                  {data && data.total_comment}
                </p>
              </div>
              <div
                className="col-md-12 document-detail-content font-italic"
                dangerouslySetInnerHTML={{ __html: data && data.description }}
              />
              <div
                className="col-md-12 document-detail-content"
                dangerouslySetInnerHTML={{ __html: data && data.content }}
              />
              {catalogId == 5 ? (
                <>
                  {data &&
                  data.attach_files &&
                  this.getImage(data.attach_files) &&
                  this.getImage(data.attach_files).length === 0 ? (
                    ''
                  ) : (
                    <div className="col-md-12 document-detail-files d-flex flex-wrap">
                      <div className=" document-detail-files-title">
                        <p>Hình ảnh :</p>
                      </div>
                      {data &&
                        data.attach_files &&
                        this.getImage(data.attach_files).map((item) => {
                          return (
                            <div className="document-detail-files-item col-md-4">
                              <img alt="" src={`${BASE_IMG}${item}`} />
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {data &&
                  data.attach_files &&
                  this.getVIdeo(data.attach_files) &&
                  this.getVIdeo(data.attach_files).length === 0 ? (
                    ''
                  ) : (
                    <div className="col-md-12 document-detail-files d-flex flex-wrap">
                      <div className=" document-detail-files-title">
                        <p> Video :</p>
                      </div>
                      {data &&
                        data.attach_files &&
                        this.getVIdeo(data.attach_files).map((item) => {
                          return (
                            <div className="document-detail-files-item col-md-4">
                              <video
                                className="upload-show-img "
                                muted
                                autoPlay
                                loop
                                playsInline
                              >
                                <source
                                  src={`${BASE_IMG}${item}`}
                                  type={`video/${item
                                    .split('.')
                                    .splice(-1, 1)[0]
                                    .toLowerCase()}`}
                                  alt=""
                                />
                              </video>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {data &&
                  data.attach_files &&
                  this.getFiles(data.attach_files) &&
                  this.getFiles(data.attach_files).length === 0 ? (
                    ''
                  ) : (
                    <div className="col-md-12 document-detail-files d-flex flex-wrap">
                      <div className=" document-detail-files-title">
                        <p>Files :</p>
                      </div>
                      {data &&
                        data.attach_files &&
                        this.getFiles(data.attach_files).map((item) => {
                          return (
                            <div className="document-detail-files-item col-md-3">
                              <FileIcon
                                extension={
                                  item &&
                                  item.split('.').splice(-1, 1)[0].toLowerCase()
                                }
                                {...defaultStyles[
                                  item &&
                                    item
                                      .split('.')
                                      .splice(-1, 1)[0]
                                      .toLowerCase()
                                ]}
                              />
                              <p>{item}</p>
                              <a href={`${item}`} download>
                                Download
                              </a>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </>
              ) : catalogId == 1 || catalogId == 2 ? (
                <>
                  {data &&
                    data.attach_files &&
                    data.attach_files.map((item, index) => (
                      <video
                        className="upload-show-img-full"
                        muted
                        autoPlay
                        loop
                        playsInline
                        controls
                        key={index}
                      >
                        <source
                          src={`${BASE_IMG}${item}`}
                          type={`video/${item
                            .split('.')
                            .splice(-1, 1)[0]
                            .toLowerCase()}`}
                          alt=""
                        />
                      </video>
                    ))}
                </>
              ) : catalogId == 4 ? (
                <div className="d-flex flex-wrap w-100 mt-5">
                  {data &&
                    data.attach_files &&
                    data.attach_files.map((item, index) => (
                      <div className="lib-img">
                        <div
                          className="background-img"
                          style={{
                            backgroundImage: `url('${BASE_IMG}${item.image}')`
                          }}
                        ></div>
                        <p className="text-center">{item.title}</p>
                      </div>
                    ))}
                </div>
              ) : catalogId == 3 ? (
                <>
                  {data &&
                    data.attach_files &&
                    data.attach_files.map((item, index) => (
                      <a
                        href={`${BASE_IMG}${item}`}
                        key={index}
                        target="_blank"
                        className="w-100"
                      >
                        <div className="text-center mt-3 w-100 icon-file">
                          <img
                            src={`${BASE_IMG}${data && data.bgr_image}`}
                            className="img-file"
                          />
                        </div>
                      </a>
                    ))}
                </>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

DetailLibrary.propTypes = {
  history: PropTypes.func.isRequired,
  user: PropTypes.func.isRequired,
  match: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(DetailLibrary));
