import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InputSearch from '../../component/common/InputSearch';
import editIcon from '../../assets/images/images/edit.png';
import deleteIcon from '../../assets/images/images/delete.png';
import Paginate from '../../component/Paginate/index';
import Table from '../../component/common/TableStudent';
import {
  DELETE_COMPETITION,
  GET_LIST_ACTIVE,
  DELETE_EVENT,
  DELETE_COURSE_DASHBOARD
} from '../../constants/config';
import { postDataWithParams, deleteById } from '../../services/base_services';
import { confirmDelete, showMessage } from '../../helpers/table';
import { formatDate } from '../../helpers/form';
import Datepicker from '../../component/common/DatepickerCustom';
import Select from '../../component/common/Select';
import { parseInt } from 'lodash';
import removeImg from '../../assets/images/remove.png';
class EventTable extends Component {
  constructor(props) {
    super(props);
    this.keyword = '';
    this.state = {
      date: "",
      status: 0,
      competition: 0,
      isLoading: true,
      loadData: false,
      perPage: 5,
      paginate: [],
      tableData: [],
      event: '',
      status: '',
      dateSearch: '',
      listEvent: [
        {
          id: 1,
          name: 'Kỳ thi'
        },
        {
          id: 2,
          name: 'Sự kiện'
        },
        {
          id: 3,
          name: 'Khóa học'
        }
      ],
      listStatus: [
        {
          id: 0,
          name: 'Mở đăng ký'
        },
        {
          id: 1,
          name: 'Chuẩn bị diễn ra'
        },
        {
          id: 2,
          name: 'Đang kết thúc'
        },
        {
          id: 3,
          name: 'Đã đủ số lượng'
        },
        {
          id: 4,
          name: 'Đã kết thúc'
        }
      ],
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
          label: 'TÊN SỰ KIỆN',
          option: {
            className: ' width-200'
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
          label: 'LOẠI HOẠT ĐỘNG',
          index: null,
          option: {
            className: ''
          },
          callback: (data) => {
            switch (data && data.activity_type) {
              case 1:
                return (
                  <div>
                    <span>Kì thi</span>
                  </div>
                );
              case 2:
                return (
                  <div>
                    <span>Sự kiện</span>
                  </div>
                );
              case 3:
                return (
                  <div>
                    <span>Khóa học</span>
                  </div>
                );
            }
          }
        },
        {
          label: 'NGÀY DIỄN RA',
          index: null,
          option: {
            className: 'text-center width-150'
          },
          callback: (data) => {
            return (
              <div>
                <span>{data && data.begin_date}</span>
              </div>
            );
          }
        },
        {
          label: 'SL VÕ SINH',
          index: null,
          option: {
            className: 'text-center width-150'
          },
          callback: (data) => {
            return (
              <div>
                <span>{data && data.total_member}</span>
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
                    data-tip="Chỉnh sửa hoạt động"
                    className="link-action ml-2 mr-2"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        this.onEdit(data.id, data.activity_type);
                      }}
                      onKeyPress={() => {}}
                    >
                      <img alt="edit" src={editIcon} className="btn-icon" />
                    </div>
                  </span>
                  <span data-tip="Xóa hoạt động" className="link-action ml-2">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => this.onDelete(data.id, data.activity_type)}
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

  resetday = () => {
    const { status, event, page } = this.state;
    this.setState({
      date: null
    });
    this.getListRequest({
      page: 1,
      per_page: 5,
      keyword: this.keyword.search_text || '',
      activity_type: parseInt(event),
      status
    });
  };
  changeDate = (value) => {
    const { status, event, page } = this.state;
    value = value.toString();

    this.setState({
      date: formatDate(value).split('-').reverse().join('-')
    });
    this.getListRequest({
      page: 1,
      per_page: 5,
      keyword: this.keyword.search_text || '',
      activity_type: parseInt(event),
      status,
      date: formatDate(value).split('-').reverse().join('-')
    });
  };

  componentDidMount = () => {
    this.getList();
  };

  onEdit = (id, activity_type) => {
    const { history } = this.props;
    switch (parseInt(activity_type)) {
      case 1:
        return history.push(`/active/competition/edit/${id}`);
      case 2:
        return history.push(`/active/event/edit/${id}`);
      case 3:
        return history.push(`/active/course/edit/${id}`);
    }
  };

  onDelete = (id, activity_type) => {
    confirmDelete().then((res) => {
      if (res.value === true) {
        this.removeRequest(id, activity_type);
      }
    });
  };

  removeRequest = (id, activity_type) => {
    let typeDelete = '';
    switch (activity_type) {
      case 1:
        typeDelete = DELETE_COMPETITION;
        break;
      case 2:
        typeDelete = DELETE_EVENT;
        break;
      case 3:
        typeDelete = DELETE_COURSE_DASHBOARD;
        break;
    }
    deleteById(typeDelete, id)
      .then((res) => {
        showMessage(res.data.message, true);
        this.getList();
      })
      .catch(() => {
        showMessage('CÓ LỖI XẢY RA!', false);
      });
  };

  getList = async () => {
    const { page, perPage, date, status, competition } = this.state;
    this.getListRequest({
      page: 1,
      per_page: perPage,
      keyword: this.keyword.search_text || ''
    });
  };

  getListRequest = async (params) => {
    const { perPage } = this.state;
    await postDataWithParams(GET_LIST_ACTIVE, params)
      .then((res) => {
        this.setState({
          tableData: res.data.data,
          paginate: {
            ...res.data.paginate,
            perPage,
            keyword: ''
          },
          isLoading: false
        });
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  changeEvent = (e) => {
    const { page, perPage, status, date } = this.state;
    this.setState({
      event: e.target.value
    });
    this.getListRequest({
      page: 1,
      per_page: 5,
      keyword: this.keyword.search_text || '',
      activity_type: parseInt(e.target.value),
      status,
      date
    });
  };

  changeCom = (e) => {
    this.setState({
      competition: e.target.value
    });
  };

  render() {
    const {
      tableHeaders,
      paginate,
      tableData,
      isLoading,
      date,
      listStatus,
      listEvent
    } = this.state;

    return (
      <>
        <div className="row">
          <div className="col-md-3 dashboard-title mt-5">
            <p>Hoạt động sắp tới</p>
          </div>
          <div className="mt-5 col-md-3 offset-3">
            <Select
              className="form-control input-form form-control-product mb-3 input-grey input-form-select"
              key_value="id"
              key_label="name"
              include_blank="Lựa chọn"
              errors={[]}
              data={listEvent}
              onChange={this.changeEvent}
            />
          </div>
          <div className="mt-5 col-md-3 position-relative">
            <img
              src={removeImg}
              className="date-picker-remove"
              onClick={this.resetday}
            />
            <Datepicker
              errors={[]}
              clearIcon={false}
              className="form-control input-form"
              onChange={this.changeDate}
              format={'dd-MM-yyyy'}
              value={formatDate(date)}
            />
          </div>
        </div>
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

EventTable.propTypes = {
  history: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(EventTable));
