/* eslint-disable camelcase */
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import editIcon from '../../assets/images/images/edit.png';
import deleteIcon from '../../assets/images/images/delete.png';
import detail from '../../assets/images/images/detail.svg';
import accpect from '../../assets/images/accept.svg';
import Table from '../../component/common/TableStudent';
import {
  GET_INFO_UNPUBLISH,
  DELETE_DOCUMENT_REQUEST,
  POST_DOCUMENT_REQUEST
} from '../../constants/config';
import {
  postDataWithParams,
  deleteById,
  putDataUrl
} from '../../services/base_services';
import { confirmDelete, showMessage, confirmPost } from '../../helpers/table';
import { formatDate } from '../../helpers/form';

class TableDocument extends Component {
  constructor(props) {
    super(props);
    this.keyword = '';
    this.state = {
      isLoading: true,
      perPage: 5,
      paginate: [],
      tableData: [],
      tableHeaders: [
        {
          label: 'STT',
          index: 'stt',
          option: {
            className: 'text-center position-relative'
          },
          callback: null
        },
        {
          label: 'TIÊU ĐỀ',
          index: null,
          option: {
            className: 'width-300'
          },
          callback: (data) => {
            return (
              <div>
                <span>{data && data.title}</span>
              </div>
            );
          }
        },
        {
          label: 'NGÀY ĐĂNG',
          index: null,
          option: {
            className: 'text-center width-200'
          },
          callback: (data) => {
            return (
              <div>
                <span>{data && data.created_at}</span>
              </div>
            );
          }
        },
        {
          label: 'TÁC GIẢ',
          index: null,
          option: {
            className: 'width-150'
          },
          callback: (data) => {
            return (
              <div>
                <span>{data && data.user && data.user.name}</span>
              </div>
            );
          }
        },
        {
          label: 'LOẠI BÀI VIẾT',
          index: null,
          option: {
            className: 'width-150'
          },
          callback: (data) => {
            return (
              <div>
                <span>{data && data.infoCatalog && data.infoCatalog.name}</span>
              </div>
            );
          }
        },
        {
          label: 'CHỨC NĂNG',
          index: null,
          option: {
            className: 'text-center fixed-collumn'
          },
          callback: (data) => {
            if (data.id) {
              return (
                <div className="btn-group">
                  {data && data.status == 2 ? (
                    ''
                  ) : (
                    <span
                      data-tip="Duyệt bài viết"
                      className="link-action ml-2 mr-2"
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          this.postDocument(data.id);
                        }}
                        onKeyPress={() => {}}
                      >
                        <img
                          alt="edit"
                          src={accpect}
                          className="btn-icon"
                          style={{ maxWidth: '19px' }}
                        />
                      </div>
                    </span>
                  )}
                  <span
                    data-tip="Chi tiết bài viết"
                    className="link-action ml-2 mr-2"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        this.onDetailStudent(data.id);
                      }}
                      onKeyPress={() => {}}
                    >
                      <img alt="edit" src={detail} className="btn-icon" />
                    </div>
                  </span>
                  <span
                    data-tip="Chỉnh sửa bài viết"
                    className="link-action ml-2 mr-2"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        this.onEditStudent(data.id);
                      }}
                      onKeyPress={() => {}}
                    >
                      <img alt="edit" src={editIcon} className="btn-icon" />
                    </div>
                  </span>
                  <span data-tip="Xóa bài viết" className="link-action ml-2">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => this.onDeleteStudent(data.id)}
                      onKeyPress={() => {}}
                    >
                      <img alt="delete" src={deleteIcon} className="btn-icon" />
                    </div>
                  </span>
                  <ReactTooltip
                    className="tooltip-button"
                    place="bottom"
                    effect="float"
                  />
                </div>
              );
            }
            return '';
          }
        }
      ]
    };
  }

  componentDidMount = () => {
    this.getListDocument();
  };

  onEditStudent = (id) => {
    const { history } = this.props;
    history.push(`/document/edit/${id}`);
  };

  onDetailStudent = (id) => {
    const { history } = this.props;
    history.push(`/document/detail/${id}`);
  };

  onDeleteStudent = (id) => {
    confirmDelete().then((res) => {
      if (res.value === true) {
        this.removeStudentRequest(id);
      }
    });
  };

  removeStudentRequest = (id) => {
    deleteById(DELETE_DOCUMENT_REQUEST, id)
      .then((res) => {
        showMessage(res.data.message, true);
        this.getListDocument();
      })
      .catch(() => {
        showMessage('CÓ LỖI XẢY RA!', false);
      });
  };

  postDocument = (id) => {
    confirmPost().then((res) => {
      if (res.value === true) {
        this.postDocumentRequest(id);
      }
    });
  };

  postDocumentRequest = (id) => {
    putDataUrl(POST_DOCUMENT_REQUEST, { id: id })
      .then((res) => {
        showMessage(res.data.message, true);
        this.getListDocument();
        this.props.getDashboardInfo();
      })
      .catch(() => {
        showMessage('CÓ LỖI XẢY RA!', false);
      });
  };

  getListDocument = async () => {
    const { page, perPage } = this.state;
    this.getListRequest({
      page,
      per_page: 5,
      keyword: this.keyword.search_text || ''
    });
  };

  getListRequest = async (params) => {
    const { perPage } = this.state;

    await postDataWithParams(GET_INFO_UNPUBLISH, params)
      .then((res) => {
        this.setState({
          tableData: res.data.data,
          paginate: {
            ...res.data.paginate,
            perPage
          },
          isLoading: false
        });
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  render() {
    const { tableHeaders, paginate, tableData, isLoading } = this.state;
    return (
      <>
        <Table
          fixed
          tableHeaders={tableHeaders}
          tableData={tableData}
          tablePaginate={paginate}
          isLoading={isLoading}
        />
      </>
    );
  }
}

TableDocument.propTypes = {
  history: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(TableDocument));
