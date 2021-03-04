import React, { Component } from 'react';
import Table from '../../component/common/TableStudent';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paginate from '../../component/Paginate/index';
import deleteIcon from '../../assets/images/images/delete.png';
import detailIcon from '../../assets/images/images/detail.svg';
import { PER_PAGE } from '../../constants/variable';
import ReactTooltip from 'react-tooltip';
import NewButton from '../../component/common/NewButton';

class ListMember extends Component {
  constructor(props) {
    super(props);
    this.keyword = '';
    this.state = {
      isLoading: false,
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
          callback: null
        },
        {
          label: 'ĐAI ĐẲNG',
          index: null,
          option: {
            className: 'text-left py-4'
          },
          callback: null
        },
        {
          label: 'CÂU LẠC BỘ',
          index: null,
          option: {
            className: 'text-center py-4'
          },
          callback: null
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
                      onKeyPress={() => { }}
                    >
                      <img alt="edit" src={detailIcon} className="btn-icon" />
                    </div>
                  </span>
                  <span data-tip="Xóa" className="link-action ml-2">
                    <div
                      role="button"
                      tabIndex={0}
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
