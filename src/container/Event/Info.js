import React from 'react';
import { getDataByID, postDataByID } from '../../services/base_services';
import { Component } from 'react';
import { GET_EVENT, BASE_IMG } from '../../constants/config';
import { withRouter, Link } from 'react-router-dom';
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
      status: 0,
      total: []
    };
  }

  getData = async (id) => {
    await getDataByID(GET_EVENT, id).then((res) => {
      this.setState({ data: res && res.data });
    });
  };
  componentDidMount = () => {
    const { id } = this.props;
    this.getData(this.props.id);
  };
  onEdit = (id) => {
    const { history } = this.props;
    history.push(`/active/event/edit/${id}`);
  };
  getImage = (array) => {
    let result = [];
    array.map((item) => {
      if (
        (item && item.split('.').splice(-1, 1)[0].toLowerCase() === 'png') ||
        item.split('.').splice(-1, 1)[0].toLowerCase() === 'jpg' ||
        item.split('.').splice(-1, 1)[0].toLowerCase() === 'jpeg' ||
        item.split('.').splice(-1, 1)[0].toLowerCase() === 'gif'
      ) {
        result = [...result, item];
      }
      return '';
    });
    return result;
  };

  render() {
    const { data } = this.state;
    return (
      <>
        <div className="m-4">
          <div className="row">
            <div className="col-md-6">
              <div className="row mt-2">
                <div className="col-md-6">Loại sự kiện:</div>
                {data && data.type == 1 ? (
                  <div className="col-md-6">Kín</div>
                ) : (
                  <div className="col-md-6">Công khai</div>
                )}
              </div>
              <div className="row mt-2">
                <div className="col-md-6">Địa điểm tổ chức:</div>
                <div className="col-md-6">{data && data.address}</div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">Thời gian diễn ra:</div>
                <div className="col-md-6">
                  {data &&
                    data.start_at &&
                    data.start_at.replace('/', '-').replace('/', '-')}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mt-2">
                Trạng thái:
                {data && data.status == 1 ? (
                  <p className="status status-true">Chuẩn bị</p>
                ) : data && data.status == 2 ? (
                  <p className="status status-true"> Đang diễn ra</p>
                ) : data && data.status == 4 ? (
                  <p className="status status-true"> Kết thúc</p>
                ) : (
                  ''
                )}
              </div>
              <div className="mt-2">
                Số võ sinh đã đăng ký: {data && data.num_member} người
              </div>
            </div>
          </div>
          {data && data.detail ? (
            <>
              <div className="row mt-2">
                <div className="col">Nội dung sự kiện:</div>
              </div>
              <div className="row mt-2">
                <div
                  className="col-md-12 document-detail-content"
                  dangerouslySetInnerHTML={{ __html: data && data.detail }}
                />
              </div>
            </>
          ) : (
            ''
          )}
          <div className="row mt-2">
            {data && data.attach_files && data.attach_files.length > 0 ? (
              <div className="col">File đính kèm</div>
            ) : (
              ''
            )}
          </div>
          <div className="row mt-2">
            {data &&
              data.attach_files &&
              this.getImage(data.attach_files).map((item, index) => {
                return (
                  <div className="list-img col-md-3 mt-4" key={index}>
                    <img alt="" src={`${BASE_IMG}${item}`} />
                  </div>
                );
              })}
          </div>
          <div className="row mt-2">
            <div className="col-md-12 mt-3">
              <ButtonSave
                onClick={() => this.onEdit(this.props.id)}
                text="Cập nhật"
                className="btn btn-new ml-0"
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
