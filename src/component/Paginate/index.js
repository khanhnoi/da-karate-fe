import React, { Component } from 'react';
import Pagination from 'react-js-pagination';
import PropTypes from 'prop-types';
import leftArrow from '../../assets/images/left-ar.png';
import rightArrow from '../../assets/images/right-ar.png';

class Paginate extends Component {
  changePage = (page) => {
    const { changePage } = this.props;
    changePage(page);
  };

  render() {
    const { changePage , paginate, per} = this.props;

    if (!paginate.total) {
      return '';
    }

    const perPage = parseInt(paginate.perPage, 10) || per || 5;

    return (
      <Pagination
        activePage={paginate.current_page}
        itemsCountPerPage={perPage}
        totalItemsCount={paginate.total}
        pageRangeDisplayed={3}
        onChange={this.changePage}
        prevPageText={<img src={leftArrow} alt="left" />}
        nextPageText={<img src={rightArrow} alt="right" />}
        hideFirstLastPages
        itemClassPrev="paginate-nav"
        itemClassNext="paginate-nav"
      />
    );
  }
}

Paginate.propTypes = {
  changePage: PropTypes.func.isRequired,
  paginate: PropTypes.isRequired,
  perPage: PropTypes.isRequired
};

export default Paginate;
