import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ManageExam from './ManageExam';
import Examiner from './Examiner';
import ListMember from './ListMember';
import Marks from './Marks';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { getDataByID } from '../../services/base_services';
import { GET_COMPETITION_REQUEST, BASE_IMG } from '../../constants/config';


class ManageCompetition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: 1,
      id: 0,
      data: []
    };
  }

  changeMenu = (num) => {
    this.setState({ menu: num });
  };

  getData = async (id) => {
    await getDataByID(GET_COMPETITION_REQUEST, id).then((res) => {
      this.setState({ data: res && res.data });
    });
  };
  componentWillMount = () => {
    const { match } = this.props;
    const { params } = match;
    const { id } = params;
    this.setState({ id: id });
    this.getData(id)
  };
  showContent = () => {
    const { menu } = this.state;
    switch (menu) {
      case 1:
        return <ManageExam id={this.state.id} />;
      case 2:
        return <Examiner id={this.state.id} />;
      case 3:
        return <ListMember id={this.state.id} />;
      case 4:
        return <Marks id={this.state.id} />;
      default:
        return <ManageExam id={this.state.id} />;
    }
  };
  render() {
    const { menu, data } = this.state;
    return (
      <>
        <div className="body-right-bottom">
          <div className="container-fluid content">
            <div className="row top-table">
              <div className="col-md-12 top-table-title">
                <p>Quản Lý Hoạt Động</p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">Kỳ Thi</div>
            </div>
            <div className="content-form">
              <div className="row">
                <div className="col-md-12 content-title">
                  <p>Quản Lý {data && data.title}</p>
                </div>
              </div>
            </div>

            <div className="tap">
              <div
                onClick={() => this.changeMenu(1)}
                className={classNames('tap-btn', 'tap-btn--left', {
                  'tap-btn--active': menu === 1
                })}
              >
                <p>THÔNG TIN CHUNG</p>
              </div>
              <div
                className={classNames('tap-btn', {
                  'tap-btn--active': menu === 2
                })}
                onClick={() => this.changeMenu(2)}
              >
                <p>HỘI ĐỒNG GIÁM KHẢO</p>
              </div>
              <div
                className={classNames('tap-btn', {
                  'tap-btn--active': menu === 3
                })}
                onClick={() => this.changeMenu(3)}
              >
                <p>DANH SÁCH VÕ SINH</p>
              </div>
              <div
                className={classNames('tap-btn', 'tap-btn--right', {
                  'tap-btn--active': menu === 4
                })}
                onClick={() => this.changeMenu(4)}
              >
                <p>CHẤM THI</p>
              </div>
            </div>
              {this.showContent()}

          </div>

        </div>
      </>
    );
  }
}
ManageCompetition.propTypes = {
  history: PropTypes.func.isRequired,
  match: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(ManageCompetition));
