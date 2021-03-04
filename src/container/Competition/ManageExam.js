import React from 'react';
import { getDataByID, postDataByID } from '../../services/base_services';
import { Component } from 'react';
import { GET_COMPETITION_REQUEST, BASE_IMG } from '../../constants/config';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ButtonSave from '../../component/common/ButtonSave';
import { formatDate } from '../../helpers/form';
import { GET_CANDIDATES, GET_STATUS_COMPETITION } from '../../constants/config';

class ManageExam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      status: [],
      total: []
    };
  }
  getData = async (id) => {
    await getDataByID(GET_COMPETITION_REQUEST, id).then((res) => {
      this.setState({ data: res && res.data });
    });
    await getDataByID(GET_STATUS_COMPETITION, id).then((res) => {
      this.setState({ status: res.data.status });
    });
    await postDataByID(GET_CANDIDATES, id, {
      keyword: '',
      page: 1,
      per_page: ''
    }).then((res) => {
      this.setState({ total: res.data.total });
    });
  };
  componentDidMount = () => {
    this.getData(this.props.id);
  };
  onEdit = (id) => {
    const { history } = this.props;
    history.push(`/active/competition/edit/${id}`);
  };
  render() {
    const { data, status, total } = this.state;
    return (
      <>
        <div className="content-form mt-4">
          <div className="row">
            <div className="col-md-6">
              <div className="row mt-2">
                <div className="col-md-6">
                  <span className="text-custom">Loại kì thi:</span>
                </div>
                <div className="col-md-6">
                  <span className="text-custom">
                    {data && data.certificate}
                  </span>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">
                  <span className="text-custom">Đối tượng tham gia :</span>
                </div>
                <div className="col-md-6">
                  <span className="text-custom">
                    {data && data.branchInfo && data.branchInfo.name !== '' ? data.branchInfo.name : 'Tất cả' }
                    {data && data.clubInfo && data.clubInfo.name !== '' ? `- ${data.clubInfo.name}` : '' }
                  </span>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">
                  <span className="text-custom">Địa điểm tổ chức :</span>
                </div>
                <div className="col-md-6">
                  <span className="text-custom">{data && data.address}</span>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">
                  <span className="text-custom">Mốc thời gian đăng ký:</span>
                </div>
                <div className="col-md-6">
                  <span className="text-custom">
                    {formatDate(data && data.regis_expiry_date, 'dd-mm-yyyy')}
                  </span>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">
                  <span className="text-custom">Mốc thời gian tổ chức: </span>
                </div>
                <div className="col-md-6">
                  <span className="text-custom">
                    {formatDate(data && data.exam_date, 'dd-mm-yyyy')}{' '}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row mt-2">
                <div className="col-md-6">
                  <span className="text-custom">Trạng thái:</span>
                </div>
                <div className="col-md-6">
                  {status === 0 || status === 3 ? (
                    <p className={`text-custom status status-true status-custom-${status}`}> Đăng ký thi</p>
                  ) : status === 1 ? (
                    <p className={`text-custom status status-true status-custom-${status}`}> Chuẩn bị thi</p>
                  ) : status === 2 ? (
                    <p className={`text-custom status status-true status-custom-${status}`}> Đang thi</p>
                  ) : status === 4 ? (
                    <p className={`text-custom status status-true status-custom-${status}`}> Kết thúc</p>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">
                  <span className="text-custom">Ban giám khảo:</span>
                </div>
                <div className="col-md-6">
                  <span className="text-custom">
                    {data && data.num_examiner} người
                  </span>
                </div>
              </div>
              
              <div className="row mt-2">
                <div className="col-md-6">
                  <span className="text-custom">Số võ sinh đã đăng ký:</span>
                </div>
                <div className="col-md-6">
                  <span className="text-custom">{total} người</span>
                </div>
              </div>
            </div>
          </div>
          {data && data.attach_files && data.attach_files.length !== 0 ? (
            <div className="row mt-2">
              <div className="col-md-3">
                <span className="text-custom">File đính kèm:</span>
              </div>
              <div className="col-md-8">
                {data &&
                  data.attach_files &&
                  data.attach_files.map((item) => {
                    return (
                      <>
                        <a
                          className="link-attach-file"
                          href={`${BASE_IMG}${item}`}
                        >
                          {item.split('/').slice(-1)[0]}
                        </a>
                        <br />
                      </>
                    );
                  })}
              </div>
            </div>
          ) : (
            ''
          )}
          {data && data.content_notify ? (
            <div className="row mt-2">
              <div className="col-md-3 ">
                <span className="text-custom">Nội dung:</span>
              </div>
              <div
                className="col-md-9 document-detail-content"
                dangerouslySetInnerHTML={{
                  __html: data && data.content_notify
                }}
              />
            </div>
          ) : (
            ''
          )}
          {data && data.exam_overview ? (
            <div className="row mt-2">
              <div className="col-md-3 ">
                <span className="text-custom">Tóm tắt:</span>
              </div>
              <div className="col-md-9 ">
                <p className="contents text-custom">
                  {data && data.exam_overview}
                </p>
              </div>
            </div>
          ) : (
            ''
          )}
          <div className="row">
            <div className="col-md-12 mt-3">
              <ButtonSave
                onClick={() => this.onEdit(this.props.id)}
                text="Cập nhật"
                className="btn btn-new btn-new-competition ml-0"
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

ManageExam.propTypes = {
  history: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(ManageExam));
