import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import NewButton from '../../component/common/NewButton';
import editIcon from '../../assets/images/images/edit.png';
import deleteIcon from '../../assets/images/images/delete.png';
import Table from '../../component/common/TableStudent';
import {
  GET_LIST_ROLES_EXAMPLE,
  DELETE_ROLE_REQUEST
} from '../../constants/config';
import { deleteById, postDataWithParams } from '../../services/base_services';
import { confirmDelete, showMessage } from '../../helpers/table';
import Paginate from '../../component/Paginate/index';
import InputSearch from '../../component/common/InputSearch';
import { PER_PAGE } from '../../constants/variable';

class TablePermission extends Component {
  constructor(props) {
    super(props);
    this.keyword = '';
    this.state = {
      isLoading: true,
      perPage: PER_PAGE,
      page: 1,
      tableData: [],
      paginate: [],
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
          label: 'TÊN PHÂN QUYỀN',
          index: null,
          callback: (data) => {
            return (
              <div>
                {data && data.allow_del ? (
                  <span>{data && data.name}</span>
                ) : (
                  <span className="name-permission-main">
                    {data && data.name}
                  </span>
                )}
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
                  <span
                    data-tip="Chỉnh sửa quyền"
                    className="link-action ml-2 mr-2"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        this.onEditRole(data.id);
                      }}
                      onKeyPress={() => {}}
                    >
                      <img alt="edit" src={editIcon} className="btn-icon" />
                    </div>
                  </span>
                  {data && data.allow_del ? (
                    <span data-tip="Xóa quyền" className="link-action ml-2">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => this.onDeleteRole(data.id)}
                        onKeyPress={() => {}}
                      >
                        <img
                          alt="delete"
                          src={deleteIcon}
                          className="btn-icon"
                        />
                      </div>
                    </span>
                  ) : (
                    ''
                  )}
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

  componentDidMount() {
    const { page, perPage } = this.state;
    this.getListRole({
      page,
      per_page: perPage,
      keyword: this.keyword.search_text || ''
    });
  }

  onEditRole = (id) => {
    const { history } = this.props;
    history.push(`/setting/permission/edit/${id}`);
  };

  onDeleteRole = (id) => {
    confirmDelete().then((res) => {
      if (res.value === true) {
        this.removeRoleRequest(id);
      }
    });
  };

  removeRoleRequest = (id) => {
    const { page, perPage } = this.state;
    deleteById(DELETE_ROLE_REQUEST, id)
      .then((res) => {
        showMessage(res.data.message, true);
        this.getListRole({
          page,
          per_page: perPage,
          keyword: this.keyword.search_text || ''
        });
      })
      .catch(() => {
        showMessage('CÓ LỖI XẢY RA!', false);
      });
  };

  getListRole = async (params) => {
    const { perPage } = this.state;
    await postDataWithParams(GET_LIST_ROLES_EXAMPLE, params)
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

  changePage = (pageNumber) => {
    const { page, perPage } = this.state;
    if (pageNumber !== page) {
      this.getListRole({
        page: pageNumber,
        per_page: perPage,
        keyword: this.keyword.search_text || ''
      });
      this.setState({ page: pageNumber });
    }
  };

  onChangeSearch = (e) => {
    const { page, perPage } = this.state;
    const { target } = e;
    const { name } = target;
    const value = target.value ? target.value : '';
    this.keyword = {
      ...this.keyword,
      [name]: value
    };
    this.getListRole({
      page,
      perPage,
      keyword: this.keyword.search_text || ''
    });
  };

  render() {
    const { tableHeaders, tableData, isLoading, paginate } = this.state;
    return (
      <>
        <div className="body-right-bottom">
          <div className="container-fluid container-shadow">
            <div className="row top-table">
              <div className="col-md-12 top-table-title">
                <p>Quản lý phân quyền</p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">Tất cả quyền</div>
            </div>
            <div className="row">
              <div className="ml-auto d-flex flex-wrap px-15px">
                <InputSearch onChange={this.onChangeSearch} />
                <Link to="/setting/permission/new" className="my-auto pb-2">
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

TablePermission.propTypes = {
  history: PropTypes.func.isRequired
};

export default withRouter(TablePermission);
