import React, { Component } from 'react';

class NewButton extends Component {
  render() {
    return (
      <button
        type="button"
        className="btn btn-outline btn-new "
        {...this.props}
      >
        <span>Thêm mới</span>
      </button>
    );
  }
}

export default NewButton;
