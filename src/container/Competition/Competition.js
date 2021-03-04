import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InputSearch from '../../component/common/InputSearch';
import detailIcon from '../../assets/images/images/detail.svg';
import deleteIcon from '../../assets/images/images/delete.png';
import Paginate from '../../component/Paginate/index';
import Table from '../../component/common/TableStudent';
import { LIST_COMPETITION, DELETE_COMPETITION } from '../../constants/config';
import { postDataWithParams, deleteById } from '../../services/base_services';
import { confirmDelete, showMessage } from '../../helpers/table';
import { formatDate } from '../../helpers/form';
import NewButton from '../../component/common/NewButton';
import { PER_PAGE } from '../../constants/variable';
class Competition extends Component {
  constructor(props) {
    super(props);
    this.keyword = '';
    this.state = {
      isLoading: true,
      loadData: false,
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
          label: 'TÊN KỲ THI',
          option: {
            className: 'text-left'
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
          label: 'ĐỊA ĐIỂM',
          index: null,
          option: {
            className: 'text-left'
          },
          callback: (data) => {
            return (
              <div>
                <span>{data && data.address}</span>
              </div>
            );
          }
        },
        {
          label: 'Thời gian',
          index: null,
          option: {
            className: 'text-center'
          },
          callback: (data) => {
            return (
              <div>
                <span>{formatDate(data && data.exam_date, 'dd-mm-yyyy')}</span>
              </div>
            );
          }
        },
        {
          label: 'Số lượng người thi',
          index: null,
          option: {
            className: 'text-center'
          },
          callback: (data) => {
            return (
              <div>
                <span>{data && data.num_member}</span>
              </div>
            );
          }
        },
        {
          label: 'CHỨC NĂNG',
          index: null,
          option: {
            className: 'text-center'
          },
          callback: (data) => {
            if (data.id) {
              return (
                <div className="btn-group">
                  <span
                    data-tip="Xem chi tiết Kỳ Thi"
                    className="link-action ml-2 mr-2"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        this.onEdit(data.id);
                      }}
                      onKeyPress={() => {}}
                    >
                      <img alt="edit" src={detailIcon} className="btn-icon" />
                    </div>
                  </span>
                  <span data-tip="Xóa Kỳ Thi" className="link-action ml-2">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => this.onDelete(data.id)}
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
    this.getList();
  };

  onEdit = (id) => {
    const { history } = this.props;
    history.push(`/active/competition/manage/${id}`);
  };

  onDelete = (id) => {
    confirmDelete().then((res) => {
      if (res.value === true) {
        this.removeRequest(id);
      }
    });
  };

  removeRequest = (id) => {
    const { tableData, page } = this.state;
    deleteById(DELETE_COMPETITION, id)
      .then((res) => {
        showMessage('Xóa thành công', true);
        if (tableData.length === 1 && page > 1)
          this.setState({ page: page - 1 });
        this.getList();
      })
      .catch(() => {
        showMessage('CÓ LỖI XẢY RA!', false);
      });
  };

  getList = async () => {
    const { page, perPage } = this.state;
    this.getListRequest({
      page,
      per_page: perPage,
      keyword: this.keyword.search_text || ''
    });
  };

  getListRequest = async (params) => {
    const { perPage } = this.state;

    await postDataWithParams(LIST_COMPETITION, params)
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
    const { page, perPage, value } = this.state;
    if (pageNumber !== page) {
      this.getListRequest({
        page: pageNumber,
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
                <p>Quản Lý Hoạt Động</p>
              </div>
              <div className="col-md-1 top-table-border  "></div>
              <div className="col-md-12 top-table-text">Kỳ Thi</div>
            </div>
            <div className="row">
              <div className="col">
                <span className="statistic-title px-2">Danh Sách Kỳ Thi</span>
              </div>
              <div className="ml-auto d-flex flex-wrap px-15px">
                <InputSearch
                  onChange={this.onChangeSearch}
                  onSubmitSearch={this.onSubmitSearch}
                />
              </div>
              <Link to="/active/competition/add" className="my-auto pb-2">
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

Competition.propTypes = {
  history: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(Competition));
