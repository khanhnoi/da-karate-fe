import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import DocumentTable from './DocumentTable';
import EventTable from './EventTable';
import { formatDate } from '../../helpers/form';
import { GET_DASHBOARD_INFO } from '../../constants/config';
import { getTakenData } from '../../services/base_services';
class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      isLoading: true,
      dataDashboard: [],
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
      ]
    };
  }

  componentDidMount = () => {
    this.getDashboardInfo();
  };

  getDashboardInfo = async (params) => {
    await getTakenData(GET_DASHBOARD_INFO, params)
      .then((res) => {
        this.setState({
          isLoading: false,
          dataDashboard: res.data
        });
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  render() {
    const { isLoading, dataDashboard } = this.state;
    return isLoading ? (
      ''
    ) : (
      <>
        <div className="body-right-bottom">
          <div className="container-fluid container-shadow">
            <div className="row top-table">
              <div className="col-md-12 top-table-title">
                <p>Thông tin chung</p>
              </div>
              <div className="col-md-1 top-table-border "></div>
            </div>
            <div className="row">
              <div className="col-md-12 dashboard-title">
                <p>Thông tin của hệ thống</p>
              </div>
              <div className="col-md-4 m-auto">
                <div className="table-dashboard">
                  <table>
                    <thead>
                      <tr>
                        <th className="table-dashboard-dark">
                          <p>HẠNG MỤC</p>
                        </th>
                        <th className="table-dashboard-light">
                          <p>CHI TIẾT</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="table-dashboard-dark">
                          <p>Phân đường</p>
                        </td>
                        <td className="table-dashboard-light">
                          <p>{dataDashboard && dataDashboard.total_branch}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="table-dashboard-dark">
                          <p>Câu lạc bộ</p>
                        </td>
                        <td className="table-dashboard-light">
                          <p>{dataDashboard && dataDashboard.total_club}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="table-dashboard-dark">
                          <p>Võ sinh</p>
                        </td>
                        <td className="table-dashboard-light">
                          <p>{dataDashboard && dataDashboard.total_member}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="table-dashboard-dark">
                          <p className="table-dashboard-dark-border">
                            Số bài viết
                          </p>
                        </td>
                        <td className="table-dashboard-light">
                          <p className="table-dashboard-light-border">
                            {dataDashboard && dataDashboard.total_post}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                className="col-md-8"
                style={{ marginTop: '25px', height: '300px' }}
              >
                <Dashboard />
              </div>
              <div className="col-md-6 dashboard-title mt-5">
                <p>Bài viết cần duyệt</p>
              </div>
              <Link to="/document/documents" className="ml-auto pb-2 mt-5">
                <button type="button" className="btn btn-outline btn-new ">
                  <span> Xem tất cả</span>
                </button>
              </Link>
              <div className="col-md-12">
                <DocumentTable getDashboardInfo={this.getDashboardInfo} />
              </div>

              <div className="col-md-12">
                <EventTable />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Homepage;
