import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';

const LoadingTable = (props) => {
  const { count } = props;
  return (
    <div className="loading-table">
      <Skeleton height={60} count={count} />
    </div>
  );
};

export default LoadingTable;

LoadingTable.propTypes = {
  count: PropTypes.number.isRequired
};
