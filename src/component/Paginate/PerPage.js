/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

const PerPage = (props) => {
  const { per_page, tablePaginate, changePerPage } = props;

  if (tablePaginate.total === 0) {
    return '';
  }
  const changePage = (e) => {
    const { value } = e.target;
    changePerPage(value);
  };

  return (
    <div className="per-page">
      <select
        value={per_page}
        className="form-control select-perpage"
        onChange={changePage}
      >
        <option value="10">10 / Trang</option>
        <option value="20">20 / Trang</option>
        <option value="30">30 / Trang</option>
        <option value="40">40 / Trang</option>
      </select>
    </div>
  );
};

export default PerPage;

PerPage.propTypes = {
  per_page: PropTypes.isRequired,
  tablePaginate: PropTypes.isRequired,
  changePerPage: PropTypes.isRequired
};
