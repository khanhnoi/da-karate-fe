import React, { Component } from 'react';
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  Label,
  ResponsiveContainer,
  linearGradient
} from 'recharts';
import { GET_CHART_DASHBOARD } from '../../constants/config';
import { postDataWithParams } from '../../services/base_services';
import leftArrow from '../../assets/images/left-ar.png';
import rightArrow from '../../assets/images/right-ar.png';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      index: 0,
      searchType: 'week',
      isLoading: true
    };
  }
  changeType = (type) => {
    const { searchType, index } = this.state;
    if (type == 'month') {
      document.querySelector('#dashboard-button-month').className = 'active';
      document.querySelector('#dashboard-button-week').className = '';
      this.setState({
        searchType: 'month',
        index: 0
      });
      this.getDataChart({ type: 'month', index: 0 });
    } else {
      document.querySelector('#dashboard-button-month').className = '';
      document.querySelector('#dashboard-button-week').className = 'active';
      this.setState({
        searchType: 'week',
        index: 0
      });
      this.getDataChart({ type: 'week', index: 0 });
    }
  };

  getDataChart = async (params) => {
    await postDataWithParams(GET_CHART_DASHBOARD, params)
      .then((res) => {
        this.setState({
          data: res.data.result,
          isLoading: false
        });
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  seacrhDown = () => {
    const { index, searchType } = this.state;
    const downIndex = parseInt(index) - 1;
    this.setState({
      index: downIndex
    });
    this.getDataChart({
      type: searchType,
      index: downIndex
    });
  };
  seacrhUp = () => {
    const { index, searchType } = this.state;
    const upIndex = parseInt(index) + 1;
    this.setState({
      index: upIndex
    });
    this.getDataChart({
      type: searchType,
      index: upIndex
    });
  };

  componentDidMount = () => {
    const { index, searchType } = this.state;

    this.getDataChart({ type: searchType, index });
  };

  render() {
    const { index, data, isLoading } = this.state;
    return isLoading ? (
      ''
    ) : (
      <>
        <div className="d-flex flex-wrap">
          <div className="dashboard-button">
            <button
              className="active"
              id="dashboard-button-week"
              onClick={() => this.changeType('week')}
            >
              Tuần
            </button>
            <button
              id="dashboard-button-month"
              onClick={() => this.changeType('month')}
            >
              Tháng
            </button>
          </div>
          <div className="ml-5 d-flex flex-wrap">
            <div className="my-auto d-flex ">
              <div
                className="dashboard-arrow mr-3 d-flex"
                onClick={this.seacrhDown}
              >
                <img src={leftArrow} alt="left" className="m-auto" />
              </div>
              {index == 0 ? (
                <>
                  <div className="dashboard-arrow dashboard-arrow-disalbe d-flex">
                    <img src={rightArrow} alt="right" className="m-auto" />
                  </div>
                </>
              ) : (
                <div className="dashboard-arrow d-flex" onClick={this.seacrhUp}>
                  <img src={rightArrow} alt="right" className="m-auto" />
                </div>
              )}
            </div>
          </div>
        </div>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 40, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="date" dy={5}>
              <Label value="" offset={0} position="insideBottomRight" />
            </XAxis>
            <YAxis>
              <Label value="" position="top" offset={20} dx={5} />
            </YAxis>
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="num_post"
              name="Số lượng Bài viết"
              stroke="#012e50"
              fill="url(#colorUv)"
            />
            <Area
              type="monotone"
              dataKey="num_user"
              name="Số lượng Người dùng"
              stroke="#fc4300"
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </>
    );
  }
}
export default Dashboard;
