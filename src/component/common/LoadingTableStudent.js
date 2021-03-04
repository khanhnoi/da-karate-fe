import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';

class LoadingTable extends Component {
  render() {
    const { count } = this.props;
    return (
      <div className="loading-table">
        <Skeleton height={60} count={count} />
      </div>
    );
  }
}

export default LoadingTable;


LoadingTable.propTypes = {
  count: PropTypes.isRequired
};

