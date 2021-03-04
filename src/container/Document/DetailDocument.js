import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getDataByID,
  postData,
  postDataWithIDParams,
  deleteById
} from '../../services/base_services';
import ButtonSave from '../../component/common/ButtonSave';
import {
  GET_DOCUMENT_REQUEST,
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
import { set } from 'lodash';

class DetailDocument extends Component {
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
      total_cmt: 0
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

  componentDidMount = async () => {
    const { match } = this.props;
    const { params } = match;
    const { id } = params;
    if (id) {
      await getDataByID(GET_DOCUMENT_REQUEST, id)
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
      this.getComment();
    }
  };

  getComment = async () => {
    const { match } = this.props;
    const { params } = match;
    const { id } = params;
    if (id) {
      await postDataWithIDParams(GET_COMMENT_REQUEST, id, {
        type: 0,
        page: 1,
        per_page: 50
      })
        .then((res) => {
          this.setState({
            comment: res.data.data,
            total_cmt: res.data.paginate.total,
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
      type: 0
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

  confirmComment = (e) => {
    e.preventDefault();
    const { match, user } = this.props;
    const { params } = match;
    const { id } = params;
    const formData = {
      post_id: id,
      content: this.content.value,
      user_id: user.user.id,
      type: 0
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

  goEdit = () => {
    const { match, history } = this.props;
    const { params } = match;
    const { id } = params;
    history.push(`/document/edit/${id}`);
  };

  seeAllProduct = () => {
    this.setState({
      seeAll: true
    });
  };

  seeAllRep = (id) => {
    this.setState({});
  };

  render() {
    const {
      data,
      isLoading,
      comment,
      commentLoading,
      isRep,
      contentRep,
      seeAll,
      listRep,
      total_cmt
    } = this.state;
    const { history, user } = this.props;
    return isLoading ? (
      ''
    ) : (
      <>
        <div className="body-right-bottom">
          <div className="container-fluid container-shadow  document-detail">
            <div className="row top-table">
              <div className="col-md-12 top-table-title">
                <p>Quản lý thông tin</p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">Chi tiết bài viết</div>
            </div>
            <div className="row mb-4">
              <div className="button-new button-new-red  mr-3">
                <span>{data && data.infoCatalog && data.infoCatalog.name}</span>
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
                  {total_cmt}
                </p>
              </div>
              <div
                className="col-md-12 document-detail-content-des"
                dangerouslySetInnerHTML={{ __html: data && data.description }}
              />
              <div
                className="col-md-12 document-detail-content"
                dangerouslySetInnerHTML={{ __html: data && data.content }}
              />
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
                        <div className="document-detail-files-item col-md-4 mx-1">
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
                            style={{
                              objectFit: 'cover',
                              objectPosition: 'center',
                              width: '100%',
                              height: '200px'
                            }}
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
              {commentLoading ? (
                ''
              ) : (
                <div className="col-md-12 document-detail-comment">
                  <div className="document-detail-comment-title">
                    <p>Bình luận : </p>
                  </div>
                  {seeAll
                    ? comment.map((item) => {
                        return (
                          <div className="document-detail-comment-item">
                            <div className="d-flex flex-wrap">
                              <div className="document-detail-comment-item-avatar">
                                <img src={`${BASE_IMG}${item.avatar}`} alt="" />
                              </div>
                              <div className="document-detail-comment-item-text d-flex flex-wrap">
                                <div className="d-flex pt-1">
                                  <div className="d-flex document-detail-comment-item-border">
                                    <div className="document-detail-comment-item-name">
                                      <p>{item.userName}</p>
                                    </div>
                                    <div className="document-detail-comment-item-cmt">
                                      <p>{item.content}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex mt-1">
                                  <div className="document-detail-comment-item-name">
                                    <p>Thích</p>
                                  </div>
                                  <div className="document-detail-comment-item-name">
                                    <p
                                      onClick={() => {
                                        this.getRep(item.id, item.content);
                                      }}
                                      onKeyPress={() => {}}
                                      role="button"
                                      tabIndex={0}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      Trả lời
                                    </p>
                                  </div>
                                  <div className="document-detail-comment-item-name">
                                    <p
                                      onClick={() => {
                                        this.deleteComment(item.id);
                                      }}
                                      onKeyPress={[]}
                                      role="button"
                                      tabIndex={0}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      Xóa
                                    </p>
                                  </div>
                                  <div className="document-detail-comment-item-name">
                                    <p
                                      onClick={() => {
                                        this.setState({
                                          listRep: [...listRep, item.id]
                                        });
                                      }}
                                      onKeyPress={() => {}}
                                      tabIndex={0}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <img
                                        src={commentImg}
                                        alt=""
                                        style={{ marginRight: '5px' }}
                                      />
                                      {item &&
                                        item.listRely &&
                                        item.listRely.length}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {item &&
                              listRep.indexOf(item.id) !== -1 &&
                              item.listRely &&
                              item.listRely.map((rep) => {
                                return (
                                  <div className="document-detail-comment-item document-detail-comment-item-rep  d-flex flex-wrap">
                                    <div className="d-flex flex-wrap">
                                      <div className="document-detail-comment-item-avatar">
                                        <img
                                          src={`${BASE_IMG}${rep.avatar}`}
                                          alt=""
                                        />
                                      </div>
                                      <div className="document-detail-comment-item-text d-flex flex-wrap">
                                        <div className="d-flex pt-1">
                                          <div className="d-flex document-detail-comment-item-border">
                                            <div className="document-detail-comment-item-name">
                                              <p>{rep.userName}</p>
                                            </div>
                                            <div className="document-detail-comment-item-cmt">
                                              <p>{rep.content}</p>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="d-flex mt-1">
                                          <div className="document-detail-comment-item-name">
                                            <p>Thích</p>
                                          </div>
                                          <div className="document-detail-comment-item-name">
                                            <p
                                              style={{ cursor: 'pointer' }}
                                              onClick={() => {
                                                this.getRep(
                                                  item.id,
                                                  rep.content
                                                );
                                              }}
                                              onKeyPress={[]}
                                              role="button"
                                              tabIndex={0}
                                            >
                                              Trả lời
                                            </p>
                                          </div>
                                          <div className="document-detail-comment-item-name">
                                            <p
                                              style={{ cursor: 'pointer' }}
                                              onClick={() => {
                                                this.deleteComment(rep.id);
                                              }}
                                              onKeyPress={[]}
                                              role="button"
                                              tabIndex={0}
                                            >
                                              Xóa
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        );
                      })
                    : comment.slice(0, 2).map((item) => {
                        return (
                          <div className="document-detail-comment-item">
                            <div className="d-flex flex-wrap">
                              <div className="document-detail-comment-item-avatar">
                                <img src={`${BASE_IMG}${item.avatar}`} alt="" />
                              </div>
                              <div className="document-detail-comment-item-text d-flex flex-wrap">
                                <div className="d-flex pt-1">
                                  <div className="d-flex document-detail-comment-item-border">
                                    <div className="document-detail-comment-item-name">
                                      <p>{item.userName}</p>
                                    </div>
                                    <div className="document-detail-comment-item-cmt">
                                      <p>{item.content}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex mt-1">
                                  <div className="document-detail-comment-item-name">
                                    <p>Thích</p>
                                  </div>
                                  <div className="document-detail-comment-item-name">
                                    <p
                                      onClick={() => {
                                        this.getRep(item.id, item.content);
                                      }}
                                      onKeyPress={() => {}}
                                      role="button"
                                      tabIndex={0}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      Trả lời
                                    </p>
                                  </div>
                                  <div className="document-detail-comment-item-name">
                                    <p
                                      onClick={() => {
                                        this.deleteComment(item.id);
                                      }}
                                      onKeyPress={[]}
                                      role="button"
                                      tabIndex={0}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      Xóa
                                    </p>
                                  </div>
                                  <div className="document-detail-comment-item-name">
                                    <p
                                      onClick={() => {
                                        this.setState({
                                          listRep: [...listRep, item.id]
                                        });
                                      }}
                                      onKeyPress={() => {}}
                                      role="button"
                                      tabIndex={0}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <img
                                        src={commentImg}
                                        alt=""
                                        style={{ marginRight: '5px' }}
                                      />
                                      {item &&
                                        item.listRely &&
                                        item.listRely.length}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {item &&
                              listRep.indexOf(item.id) !== -1 &&
                              item.listRely &&
                              item.listRely.map((rep) => {
                                return (
                                  <div className="document-detail-comment-item document-detail-comment-item-rep  d-flex flex-wrap">
                                    <div className="d-flex flex-wrap">
                                      <div className="document-detail-comment-item-avatar">
                                        <img
                                          src={`${BASE_IMG}${rep.avatar}`}
                                          alt=""
                                        />
                                      </div>
                                      <div className="document-detail-comment-item-text d-flex flex-wrap">
                                        <div className="d-flex pt-1">
                                          <div className="d-flex document-detail-comment-item-border">
                                            <div className="document-detail-comment-item-name">
                                              <p>{rep.userName}</p>
                                            </div>
                                            <div className="document-detail-comment-item-cmt">
                                              <p>{rep.content}</p>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="d-flex mt-1">
                                          <div className="document-detail-comment-item-name">
                                            <p>Thích</p>
                                          </div>
                                          <div className="document-detail-comment-item-name">
                                            <p
                                              style={{ cursor: 'pointer' }}
                                              onClick={() => {
                                                this.getRep(
                                                  item.id,
                                                  rep.content
                                                );
                                              }}
                                              onKeyPress={[]}
                                              role="button"
                                              tabIndex={0}
                                            >
                                              Trả lời
                                            </p>
                                          </div>
                                          <div className="document-detail-comment-item-name">
                                            <p
                                              style={{ cursor: 'pointer' }}
                                              onClick={() => {
                                                this.deleteComment(rep.id);
                                              }}
                                              onKeyPress={[]}
                                              role="button"
                                              tabIndex={0}
                                            >
                                              Xóa
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        );
                      })}
                  {seeAll ? (
                    ''
                  ) : (
                    <>
                      <div className="document-detail-comment-see">
                        {comment.length < 3 ? (
                          ''
                        ) : (
                          <p onClick={this.seeAllProduct}>
                            Xem tất cả {comment.length - 2} bình luận
                          </p>
                        )}
                      </div>
                    </>
                  )}
                  {isRep ? (
                    <form
                      className="document-detail-comment-chat d-flex d-wrap"
                      onSubmit={this.repComment}
                      id="form-input"
                    >
                      <div className="document-detail-comment-chat-avatar">
                        <img src={`${BASE_IMG}${user.user.avatar}`} alt="" />
                      </div>
                      <div className="document-detail-comment-chat-input document-detail-comment-chat-input-rep">
                        <div className="d-flex">
                          <p>
                            Trả lời :<span>{contentRep}</span>
                          </p>
                          <span
                            className="-clear"
                            onClick={this.destroyRep}
                            onKeyPress={[]}
                            role="button"
                            tabIndex={0}
                          >
                            Hủy
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="Nhập nội dung bình luận ..."
                          ref={(c) => {
                            this.content = c;
                          }}
                        />
                        <img
                          alt=""
                          src={inputIcon}
                          onClick={this.repComment}
                          onKeyPress={[]}
                          role="button"
                          tabIndex={0}
                        />
                      </div>
                    </form>
                  ) : (
                    <form
                      className="document-detail-comment-chat d-flex d-wrap"
                      onSubmit={this.confirmComment}
                      id="form-input"
                    >
                      <div className="document-detail-comment-chat-avatar">
                        <img src={`${BASE_IMG}${user.user.avatar}`} alt="" />
                      </div>
                      <div className="document-detail-comment-chat-input">
                        <input
                          type="text"
                          placeholder="Nhập nội dung bình luận ..."
                          ref={(c) => {
                            this.content = c;
                          }}
                        />
                        <img
                          alt=""
                          src={inputIcon}
                          onClick={this.confirmComment}
                          onKeyPress={[]}
                          role="button"
                          tabIndex={0}
                        />
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

DetailDocument.propTypes = {
  history: PropTypes.func.isRequired,
  user: PropTypes.func.isRequired,
  match: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(DetailDocument));
