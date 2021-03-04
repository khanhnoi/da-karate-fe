import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Alert extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { row } = this.props;
    const { messsage } = this.props;
    if (!messsage) {
      return '';
    }
    return (
      <div
        className={
          row ? 'invalid-feedback invalid-feedback-row ' : 'invalid-feedback'
        }
      >
        {messsage}
      </div>
    );
  }
}

export default Alert;

Alert.propTypes = {
  row: PropTypes.isRequired,
  messsage: PropTypes.isRequired
};