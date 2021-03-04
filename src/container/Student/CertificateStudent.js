import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import editIcon from '../../assets/images/icon/edit-kn.svg';
import deleteIcon from '../../assets/images/images/delete.png';
import NewButton from '../../component/common/NewButton';
import Table from '../../component/common/TableStudent';
import Paginate from '../../component/Paginate/index';
import {
  ACCEPT_USER,
  BASE_IMG,
  DELETE_CERTIFICATE_REQUEST,
  GET_LIST_CERTIFICATE,
  UPDATE_USER_APP
} from '../../constants/config';
import { PER_PAGE } from '../../constants/variable';
import { checkUser, confirmDelete, showMessage } from '../../helpers/table';
import {
  deleteById,
  postDataByID,
  putDataAcceptUser
} from '../../services/base_services';
import ICON_CLIP from './../../assets/images/icon/clip.svg';
import NavStudent from './NavStudent';

class StudentCertificate extends Component {
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
          label: 'NGÀY THI/ CẤP BẰNG',
          index: null,
          option: {
            className: 'text-center'
          },
          callback: (data) => {
            if (data && data.license_date !== null)
              return (
                <div>
                  <span>{data && data.license_date}</span>
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
          label: 'CẤP ĐAI/ĐẲNG',
          index: null,
          option: {
            className: 'text-center'
          },
          callback: (data) => {
            return (
              <div className="d-flex justify-content-center">
                <span className={`belt-user-${data && data.belt_id}`}></span>
                <span>{data && data.infoBelt && data.infoBelt.name}</span>
              </div>
            );
          }
        },
        {
          label: 'CHỨNG CHỈ TƯƠNG ỨNG',
          index: null,
          option: {
            className: 'text-center'
          },
          callback: (data) => {
            return (
              <div>
                {data && data.certificate_image ? (
                  <span>
                    <a
                      data-fancybox="images"
                      href={`${BASE_IMG}${data.certificate_image}`}
                    >
                      <div class="box-certificate justify-content-center">
                        <div className="box-certificate-icon">
                          <img src={ICON_CLIP} className="img-certificate" />
                        </div>
                        <div className="box-certificate-text">
                          <p>Chứng chỉ</p>
                        </div>
                      </div>
                    </a>
                  </span>
                ) : (
                    <div className="text-center">
                      <span>{" - "}</span>
                    </div>
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
                    data-tip="Chỉnh Sửa Văn Bằng"
                    className="link-action ml-2 mr-2"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => this.onEditCertificate(data.id)}
                      onKeyPress={() => { }}
                    >
                      <img alt="edit" src={editIcon} className="btn-icon" />
                    </div>
                  </span>
                  <span data-tip="Xóa Văn Bằng" className="link-action ml-2">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => this.onDeleteCertificate(data.id)}
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

  onEditCertificate = (id) => {
    const { history } = this.props;
    history.push(
      `/statistical/student/${this.props.match.params.id}/certificate/edit/${id}`
    );
  };

  onDeleteCertificate = (id) => {
    confirmDelete().then((res) => {
      if (res.value === true) {
        this.removeCertificateRequest(id);
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

  removeCertificateRequest = (id) => {
    deleteById(DELETE_CERTIFICATE_REQUEST, id)
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
    const { id } = this.props.match.params;
    const { perPage } = this.state;
    await postDataByID(GET_LIST_CERTIFICATE, id, params)
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
    const { tableHeaders, paginate, tableData } = this.state;
    return (
      <>
        <div className="body-right-bottom">
          <div className="content">
            <NavStudent />
            <div className="container-fluid mt-5 pt-0">
              <div className="row">
                <div className="content-form">
                  <div className="content-title">
                    <p>Lịch Sử Lên Đai</p>
                  </div>
                </div>
                <Link
                  to={`/statistical/student/${this.props.match.params.id}/certificate/add`}
                  className="my-auto pb-2 ml-auto"
                >
                  <NewButton />
                </Link>
                <div className="col-md-12">
                  <Table
                    fixed
                    tableHeaders={tableHeaders}
                    tableData={tableData}
                    tablePaginate={paginate}
                    isLoading={false}
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

export default withRouter(StudentCertificate);
