import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import InputSearch from '../../component/common/InputSearch';
import NewButton from '../../component/common/NewButton';
import checkIcon from '../../assets/images/icon/box-ok-kn.svg';
import editIcon from '../../assets/images/icon/view-kn.svg';
import deleteIcon from '../../assets/images/images/delete.png';
import Paginate from '../../component/Paginate/index';
import Table from '../../component/common/TableStudent';
import {
  LIST_STUDENT_REQUEST,
  DELETE_STUDENT_REQUEST,
  UPDATE_USER_APP,
  ACCEPT_USER
} from '../../constants/config';
import {
  postDataWithParams,
  deleteById,
  putDataAcceptUser
} from '../../services/base_services';
import { confirmDelete, showMessage, checkUser } from '../../helpers/table';
import { formatDate } from '../../helpers/form';
import { PER_PAGE } from '../../constants/variable';

class TableStudent extends Component {
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
          label: 'HỌ TÊN',
          index: null,
          option: {
            className: 'width-200'
          },
          callback: (data) => {
            if (data && data.name !== null)
              return (
                <div>
                  <span>{data && data.name}</span>
                </div>
              );
            return (
              <div className="text-center">
                <span>{" - "}</span>
              </div>
            );
          }
        },
        {
          label: 'NGÀY NHẬP MÔN',
          index: null,
          option: {
            className: 'text-center'
          },
          callback: (data) => {
            return (
              <div>
                <span>
                  {data && data.join_date && formatDate(data.join_date)}
                </span>
              </div>
            );
          }
        },
        {
          label: 'Đai đẳng',
          index: null,
          option: {
            className: 'text-center width-200'
          },
          callback: (data) => {
            return (
              <div className="d-flex">
                <span className={`belt-user-${data && data.belt_id}`}></span>
                <span>{data && data.infoBelt && data.infoBelt.name}</span>
              </div>
            );
          }
        },
        {
          label: 'CÂU LẠC BỘ',
          index: null,
          option: {
            className: 'width-200'
          },
          callback: (data) => {
            if (data && data.infoClub && data.infoClub.name !== null)
              return (
                <div>
                  <span>{data && data.infoClub && data.infoClub.name}</span>
                </div>
              );
            return (
              <div className="text-center">
                <span>{" - "}</span>
              </div>
            );
          }
        },
        {
          label: 'TRẠNG THÁI ',
          index: null,
          option: {
            className: 'text-center width-200'
          },
          callback: (data) => {
            switch (data && data.status) {
              case 0:
                return (
                  <div>
                    {data && data.status ? (
                      <span style={{ color: '#08a041' }}>Đang Hoạt Động</span>
                    ) : (
                        <span style={{ color: '#8898AA' }}>Không Hoạt Động</span>
                      )}
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
            className: 'text-right fixed-collumn'
          },
          callback: (data) => {
            if (data.id) {
              return (
                <div className="btn-group">
                  {data && data.clubMember && data.clubMember.status === 0 && (
                    <span
                      data-tip="Xác Nhận Đăng Kí Qua App"
                      className="link-action ml-2 mr-2"
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => this.onCheckStudent(data.id)}
                        onKeyPress={() => { }}
                      >
                        <img alt="edit" src={checkIcon} className="btn-icon" />
                      </div>
                    </span>
                  )}

                  <span
                    data-tip="Chỉnh Sửa Võ Sinh"
                    className="link-action ml-2 mr-2"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        this.onEditStudent(data.id);
                      }}
                      onKeyPress={() => { }}
                    >
                      <img alt="edit" src={editIcon} className="btn-icon" />
                    </div>
                  </span>
                  <span data-tip="Xóa Võ Sinh" className="link-action ml-2">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => this.onDeleteStudent(data.id)}
                      onKeyPress={() => { }}
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
    this.getListStudent();
  };

  onEditStudent = (id) => {
    const { history } = this.props;
    history.push(`/statistical/student/edit/${id}`);
  };

  onDeleteStudent = (id) => {
    confirmDelete().then((res) => {
      if (res.value === true) {
        this.removeStudentRequest(id);
      }
    });
  };

  onCheckStudent = (id) => {
    checkUser().then((res) => {
      if (res.value === true) {
        putDataAcceptUser(UPDATE_USER_APP, ACCEPT_USER, id)
          .then((res) => {
            showMessage(res.data.message, true);
            this.getListStudent();
          })
          .catch(() => {
            showMessage('CÓ LỖI XẢY RA!', false);
          });
      }
    });
  };

  removeStudentRequest = (id) => {
    deleteById(DELETE_STUDENT_REQUEST, id)
      .then((res) => {
        showMessage(res.data.message, true);
        this.getListStudent();
      })
      .catch(() => {
        showMessage('CÓ LỖI XẢY RA!', false);
      });
  };

  getListStudent = async () => {
    const { page, perPage } = this.state;
    this.getListRequest({
      page,
      // eslint-disable-next-line camelcase
      per_page: perPage,
      keyword: this.keyword.search_text || ''
    });
  };

  getListRequest = async (params) => {
    const { perPage } = this.state;

    await postDataWithParams(LIST_STUDENT_REQUEST, params)
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
          keyword: this.keyword.search_text || ''
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
          keyword: this.keyword.search_text || ''
        }),
      500
    );
  };

  changePage = (pageNumber) => {
    const { page, perPage } = this.state;
    if (pageNumber !== page) {
      this.getListRequest({
        page: pageNumber,
        // eslint-disable-next-line camelcase
        per_page: perPage,
        keyword: this.keyword.search_text || ''
      });
      this.setState({ page: pageNumber });
    }
  };

  render() {
    const { tableHeaders, paginate, tableData, isLoading } = this.state;
    return (
      <>
        <div className="body-right-bottom">
          <div className="container-fluid content">
            <div className="row top-table">
              <div className="col-md-12 top-table-title">
                <p>Quản Lý Võ Sinh</p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">Danh Sách Võ Sinh </div>
            </div>
            <div className="row">
              <div className="ml-auto d-flex flex-wrap px-15px">
                <InputSearch
                  onChange={this.onChangeSearch}
                  onSubmitSearch={this.onSubmitSearch}
                />
              </div>
              <Link to="/statistical/student/new" className="my-auto pb-2">
                <NewButton />
              </Link>
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

TableStudent.propTypes = {
  history: PropTypes.func.isRequired
};

export default withRouter(TableStudent);
