import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import editIcon from '../../assets/images/images/edit.png';
import detailIcon from '../../assets/images/images/detail.svg';
import deleteIcon from '../../assets/images/images/delete.png';
import Paginate from '../../component/Paginate/index';
import Table from '../../component/common/TableStudent';
import { postDataWithParams, deleteById, postDataByID } from '../../services/base_services';
import { confirmDelete, showMessage } from '../../helpers/table';
import ButtonSave from '../../component/common/ButtonSave';
import { PER_PAGE } from '../../constants/variable';
import InputText from '../../component/common/InputText';
import Select from '../../component/common/Select';
import { GET_CANDIDATES } from '../../constants/config';
import {
  destructServerErrors,
  destructServerMessage
} from '../../helpers/error';

class Marks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: [],
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
            className: 'text-left'
          },
          callback: (data) => {
            return <div>{data && data.name}</div>
          }
        },
        {
          label: 'Bài 1',
          index: null,
          option: {
            className: 'text-center'
          },
          callback: (data) => {
            return <div>10</div>
          }
        },

        {
          label: 'Bài 2',
          index: null,
          option: {
            className: 'text-center'
          },
          callback: (data) => {
            return <div>10</div>
          }
        },
        {
          label: 'Bài 3',
          index: null,
          option: {
            className: 'text-center'
          },
          callback: (data) => {
            return <div>10</div>
          }
        },
        {
          label: 'Trạng thái',
          index: null,
          option: {
            className: 'text-center'
          },
          callback: (data) => {
            return <div>Đã chấm</div>
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
      ]
    }
  }
  componentDidMount = () => {
    this.getList()
  }

  getList = async () => {
    const { id } = this.props
    const { page, perPage } = this.state;
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
  onEdit = (id) => {
  };

  onDelete = (id) => {
  };
  render() {
    const { tableData, tableHeaders, paginate, isLoading, errors } = this.state
    return (
      <>
        <div className="content-form">
          <div className="row mt-2 mt-4">
            <div className="col-md-6">
              <div className="content-title pt-2">
                <p>Nội Dung Bài Thi:</p>
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-6">
              <Select
                label="Tên võ sinh :"
                className="form-control input-form mb-3"
                name="name"
                errors={errors}
                key_value="id"
                key_label="name"
                data={tableData}
              />
            </div></div>
          <div className="row mt-2">
            <div className="col-md-3">
              <InputText
                className="form-control input-form"
                placeholder="10"
                name="mark1"
                label="Điểm bài 1: "
                errors={errors}
                type="number"
              />
            </div>
            <div className="col-md-9">
              <InputText
                className="form-control input-form"
                placeholder="Tốt"
                name="comment1"
                label="Nhận xét/Ghi chú "
                errors={errors}
                type="text"
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-3">
              <InputText
                className="form-control input-form"
                placeholder="10"
                name="mark2"
                label="Điểm bài 2: "
                errors={errors}
                type="number"
              />
            </div>
            <div className="col-md-9">
              <InputText
                className="form-control input-form"
                placeholder="Tốt"
                name="comment2"
                label="Nhận xét/Ghi chú "
                errors={errors}
                type="text"
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-3">
              <InputText
                className="form-control input-form"
                placeholder="10"
                name="mark3"
                label="Điểm bài 3: "
                errors={errors}
                type="number"
              />
            </div>
            <div className="col-md-9">
              <InputText
                className="form-control input-form"
                placeholder="Tốt"
                name="comment3"
                label="Nhận xét/Ghi chú "
                errors={errors}
                type="text"
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-4">
              <ButtonSave
                text="Lưu điểm"
                className="btn btn-new col-md-6 offset-md-6"
              />
            </div>
          </div>
        </div>

        <div className="row justify-content-between mt-4 ">
          <div className="ml-4">
            <p className="statistic-title px-2">Danh Sách Võ Sinh Đã Thi</p>
          </div>
        </div>
        <div className="row mt-2">
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
Marks.propTypes = {
  history: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(Marks));