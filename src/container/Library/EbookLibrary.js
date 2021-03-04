import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InputSearch from '../../component/common/InputSearch';
import NewButton from '../../component/common/NewButton';
import editIcon from '../../assets/images/images/edit.png';
import deleteIcon from '../../assets/images/images/delete.png';
import detail from '../../assets/images/images/detail.svg'
import accpect from '../../assets/images/accept.svg';
import Paginate from '../../component/Paginate/index';
import Table from '../../component/common/TableStudent';
import {
  LIST_LIBRARY_REQUEST,
  DELETE_LIBRARY_REQUEST,
  POST_LIBRARY_REQUEST
} from '../../constants/config';
import {
  postDataWithParams,
  deleteById,
  putDataUrl
} from '../../services/base_services';
import { confirmDelete, showMessage, confirmPost } from '../../helpers/table';
import { formatDate } from '../../helpers/form';
import { PER_PAGE } from '../../constants/variable';

class TableLibrary extends Component {
  constructor(props) {
    super(props);
    this.keyword = '';
    this.state = {
      isLoading: true,
      perPage: PER_PAGE,
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
          option: {
            className: 'width-300'
          },
          index: null,
          callback: (data) => {
            return (
              <div>
                <span>{data && data.title}</span>
              </div>
            );
          }
        },
        {
          label: 'NGÀY GỬI',
          index: null,
          option: {
            className: 'text-center width-200'
          },
          callback: (data) => {
            return (
              <div>
                <span>
                  {data && data.updated_at && formatDate(data.updated_at)}
                </span>
              </div>
            );
          }
        },
        {
          label: 'TÁC GIẢ',
          index: null,
          option: {
            className: 'text-center width-200'
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
          label: 'LOẠI TÀI LIỆU',
          index: null,
          option: {
            className: 'text-center width-200'
          },
          callback: (data) => {
            return (
              <div>
                <span>{data && data.Catalog && data.Catalog.name}</span>
              </div>
            );
          }
        },
        {
          label: 'TRẠNG THÁI',
          index: null,
          option: {
            className: 'text-center width-150'
          },
          callback: (data) => {
            switch (data && data.status) {
              case 0:
                return (
                  <div>
                    <span>Lưu nháp</span>
                  </div>
                );
              case 1:
                return (
                  <div>
                    <span>Chờ duyệt</span>
                  </div>
                );
              case 2:
                return (
                  <div>
                    <span>Đã đăng</span>
                  </div>
                );
              default:
                break;
            }
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
                    data-tip="Chi tiết tư liệu"
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
                    data-tip="Chỉnh sửa tư liệu"
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
                  <span data-tip="Xóa tư liệu" className="link-action ml-2">
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
    history.push(`/libraries/edit/${id}`);
  };

  onDetailStudent = (id) => {
    const { history } = this.props;
    history.push(`/libraries/detail/${id}`);
  };

  onDeleteStudent = (id) => {
    confirmDelete().then((res) => {
      if (res.value === true) {
        this.removeStudentRequest(id);
      }
    });
  };

  removeStudentRequest = (id) => {
    deleteById(DELETE_LIBRARY_REQUEST, id)
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
    putDataUrl(POST_LIBRARY_REQUEST, { id: id })
      .then((res) => {
        showMessage(res.data.message, true);
        this.getListDocument();
      })
      .catch(() => {
        showMessage('CÓ LỖI XẢY RA!', false);
      });
  };

  getListDocument = async () => {
    const { page, perPage } = this.state;
    this.getListRequest({
      page,
      per_page: perPage,
      keyword: this.keyword.search_text || '',
      catalog_id: 3
    });
  };

  getListRequest = async (params) => {
    const { perPage } = this.state;

    await postDataWithParams(LIST_LIBRARY_REQUEST, params)
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

  onChangeSearch = (e) => {
    clearTimeout(this.timer);
    const { page, perPage } = this.state;
    const { target } = e;
    const { name } = target;
    const value = target.value ? target.value : '';
    this.keyword = {
      ...this.keyword,
      [name]: value
    };
    this.timer = setTimeout(
      () =>
        this.getListRequest({
          page,
          per_page: perPage,
          keyword: this.keyword.search_text || '',
          catalog_id: 3
        }),
      500
    );
  };

  onSubmitSearch = (e) => {
    e.preventDefault();
    clearTimeout(this.timer);
    const { page, perPage } = this.state;
    const { target } = e;
    const { name } = target;
    const value = target.value ? target.value : '';
    this.keyword = {
      ...this.keyword,
      [name]: value
    };
    this.timer = setTimeout(
      () =>
        this.getListRequest({
          page,
          per_page: perPage,
          keyword: this.keyword.search_text || '',
          catalog_id: 3
        }),
      500
    );
  };

  changePage = (pageNumber) => {
    const { page, perPage } = this.state;
    if (pageNumber !== page) {
      this.getListRequest({
        page: pageNumber,
        per_page: perPage,
        keyword: this.keyword.search_text || '',
        catalog_id: 3
      });
      this.setState({ page: pageNumber });
    }
  };

  render() {
    const { tableHeaders, paginate, tableData, isLoading } = this.state;
    return (
      <>
        <div className="body-right-bottom">
          <div className="container-fluid container-shadow">
            <div className="row top-table">
              <div className="col-md-12 top-table-title">
                <p>Quản lý tư liệu </p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">Tất cả tư liệu </div>
            </div>
            <div className="row">
              <div className="ml-auto d-flex flex-wrap px-15px">
                <InputSearch
                  onChange={this.onChangeSearch}
                  onSubmitSearch={this.onSubmitSearch}
                />
                <Link
                  to={{
                    pathname: '/libraries/new',
                    query: { log_id: 3 }
                  }}
                  className="my-auto pb-2"
                >
                  <NewButton />
                </Link>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Table
                  fixed
                  tableHeaders={tableHeaders}
                  tableData={tableData}
                  tablePaginate={paginate}
                  isLoading={isLoading}
                />
              </div>
              <div className="table-pagenatie ml-auto">
                <div className="paginate-wrapper">
                  <Paginate paginate={paginate} changePage={this.changePage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

TableLibrary.propTypes = {
  history: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(TableLibrary));
