import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavStudent = (props) => {
  const { match } = props;
  const { params } = match;
  const { id } = params;
  return (
    <>
      <div className="container-fluid">
        <div className="row top-table">
          <div className="col-md-12 top-table-title">
            <p>Quản Lý Võ Sinh </p>
          </div>
          <div className="col-md-1 top-table-border "></div>
          <div className="col-md-12 top-table-text">Thông Tin Võ Sinh </div>
        </div>
        <div className="row  pb-0">
          <div className="col-md-12">
            <div className="d-flex student-nav">
              <NavLink
                to={`/statistical/student/edit/${id}`}
                activeClassName="buttons-btn--active"
                className="buttons-btn buttons-btn--left"
              >
                <p>THÔNG TIN CÁ NHÂN</p>

              </NavLink>
              <NavLink
                to={`/statistical/student/certificate/${id}`}
                activeClassName="buttons-btn--active"
                className="buttons-btn"
              >
                <p> VĂN BẰNG</p>

              </NavLink>
              <NavLink
                to={`/statistical/student/history/${id}`}
                activeClassName="buttons-btn--active"
                className="buttons-btn"
              >
                <p> LỊCH SỬ HOẠT ĐỘNG</p>

              </NavLink>
              <NavLink
                to={`/statistical/student/role/${id}`}
                activeClassName="buttons-btn--active"
                className="buttons-btn buttons-btn--right"
              >
                <p>THÔNG TIN PHÂN QUYỀN</p>

              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

NavStudent.propTypes = {
  match: PropTypes.func.isRequired
};

export default withRouter(NavStudent);
