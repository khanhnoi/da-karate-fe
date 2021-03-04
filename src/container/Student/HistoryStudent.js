/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import NavStudent from './NavStudent';
import { PER_PAGE } from '../../constants/variable';
import InputSearch from '../../component/common/InputSearch';
import NewButton from '../../component/common/NewButton';
import Paginate from '../../component/Paginate/index';
import Table from '../../component/common/TableStudent';
import {
  DELETE_STUDENT_REQUEST,
  UPDATE_USER_APP,
  ACCEPT_USER,
  GET_LIST_HISTORY_CLUB
} from '../../constants/config';
import {
  deleteById,
  putDataAcceptUser,
  postDataByID
} from '../../services/base_services';
import { confirmDelete, showMessage, checkUser } from '../../helpers/table';

class HistoryStudent extends Component {
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
          label: 'tên câu lạc bộ',
          index: null,
          callback: (data) => {
            if (data && data.club_name !== null)
              return (
                <div>
                  <span>{data && data.club_name}</span>
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
          label: 'Thuộc phân đường',
          index: null,
          option: {
            className: 'text-center'
          },
          callback: (data) => {
            if (data && data.branch_name !== null)
              return (
                <div>
                  <span>{data && data.branch_name}</span>
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
          label: 'Bắt đầu',
          index: null,
          callback: (data) => {
            if (data && data.start_at !== null)
              return (
                <div>
                  <span>{data && data.start_at}</span>
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
          label: 'Kết thúc',
          index: null,
          callback: (data) => {
            if (data && data.end_at !== null)
              return (
                <div>
                  <span>{data && data.end_at}</span>
                </div>
              );
            return (
              <div className="text-center">
                <span>{" - "}</span>
              </div>
            );
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
    const { id } = this.props.match.params;
    await postDataByID(GET_LIST_HISTORY_CLUB, id, params)
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
          <div className="content">
            <NavStudent />
            <div className="container-fluid pt-4">
              <div className="row">
                <div className="content-form">
                  <div className="content-title">
                    <p>Lịch sử hoạt động</p>
                  </div>
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
                    <Paginate
                      paginate={paginate}
                      changePage={this.changePage}
                    />
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

export default withRouter(HistoryStudent);
