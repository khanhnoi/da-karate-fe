import React, { Component } from 'react';
import Table from '../../component/common/TableStudent';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paginate from '../../component/Paginate/index';
import { BASE_IMG } from '../../constants/config';
import defaultAvatar from '../../assets/images/icon/user-avatar-kn .svg'
import { postDataByID, deleteById } from '../../services/base_services';
import deleteIcon from '../../assets/images/images/delete.png';
import detailIcon from '../../assets/images/images/detail.svg';
import { PER_PAGE } from '../../constants/variable';
import ReactTooltip from 'react-tooltip';
import { confirmDelete, showMessage } from '../../helpers/table';
import { GET_CANDIDATES } from '../../constants/config';

class ListMember extends Component {
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
            className: 'text-center position-relative py-4'
          },
          callback: null
        },
        {
          label: 'HỌ TÊN',
          index: null,
          option: {
            className: 'text-left'
          },
          callback: (data) => {
            return (
              <div className="img-avatar">
                <div className="img-avatar-img">
                  {data && data.avatar ? (<img src={`${BASE_IMG}${data && data.avatar}`} />)
                    : (<img src={defaultAvatar} />)}
                </div>
                <div className="img-avatar-content">
                  <div className="img-avatar-content-name">
                    <p>{data && data.name}</p>
                  </div>
                </div>
              </div>
            );
          }
        },
        {
          label: 'ĐAI ĐẲNG',
          index: null,
          option: {
            className: 'text-left py-4'
          },
          callback: (data) => {
            return (
              <div>
                <span>{data && data.beltInfo && data.beltInfo.name}</span>
              </div>
            );
          }
        },
        {
          label: 'CÂU LẠC BỘ',
          index: null,
          option: {
            className: 'text-center py-4'
          },
          callback: (data) => {
            return (
              <div>
                <span>{data && data.clubInfo && data.clubInfo.name}</span>
              </div>
            );
          }
        },
        {
          label: 'CHỨC NĂNG',
          index: null,
          option: {
            className: 'text-center py-4'
          },
          callback: (data) => {
            if (data.id) {
              return (
                <div className="btn-group">
                  <span
                    data-tip="Xem chi tiết"
                    className="link-action ml-2 mr-2"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        this.onEdit(data.id);
                      }}
                      onKeyPress={() => { }}
                    >
                      <img alt="edit" src={detailIcon} className="btn-icon" />
                    </div>
                  </span>
                  <span data-tip="Xóa" className="link-action ml-2">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => this.onDelete(data.id)}
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
      ],
    }
  }

  componentDidMount = () => {
    this.getList()
  }

  getList = async () => {
    const { id } = this.props
    const { perPage } = this.state;
    await postDataByID(GET_CANDIDATES, id, {
      keyword: "",
      page: 1,
      per_page: ""
    }).then((res) => {
      this.setState({
        tableData: res.data?.data,
        isLoading: false,
        paginate: {
          ...res.data.paginate,
          perPage
        },
      })
    })
  };

  changePage = async (pageNumber) => {
    const { id } = this.props.id
    const { page, perPage } = this.state;
    if (pageNumber !== page) {
      await postDataByID(GET_CANDIDATES, id, {
        keyword: "",
        page: pageNumber,
        per_page: perPage
      }).then((res) => {
        this.setState({
          tableData: res.data?.data,
          paginate: {
            ...res.data.paginate,
            perPage
          },
        })
      })
      this.setState({ page: pageNumber });
    }
  };

  onEdit = (id) => {
    const { history } = this.props;
    history.push(`/statistical/student/edit/${id}`);
  };

  onDelete = (id) => {
    confirmDelete().then((res) => {
      if (res.value === true) {
        this.removeRequest(id);
      }
    });
  };

  removeRequest = (id) => {
    deleteById('/candidate', id)
      .then((res) => {
        showMessage(res.data.message, true);
        this.getList();
      })
      .catch(() => {
        showMessage('CÓ LỖI XẢY RA!', false);
      });
  };

  render() {
    const { tableData, tableHeaders, paginate, isLoading } = this.state
    return (
      <>
        <div className="row justify-content-between mt-4 ">
          <div className="ml-4">
            <p className="statistic-title px-2">Danh sách Võ sinh</p>
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
      </>
    );
  }
};
ListMember.propTypes = {
  history: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(ListMember));
