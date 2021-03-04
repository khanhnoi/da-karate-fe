/* eslint-disable react/display-name */
import React from 'react';
import searchIcon from '../../assets/images/icon/ic-search.svg';

const InputSearch = React.forwardRef((props) => {
  const { onSubmitSearch } = props;
  return (
    <>
      <form className="form-search" onSubmit={onSubmitSearch}>
        <img src={searchIcon} alt="" className="form-search-icon" />
        <input
          name="search_text"
          className="form-search-input"
          placeholder="Tìm kiếm nội dung"
          onKeyPress={(e) => {
            e.key === 'Enter' && e.preventDefault();
          }}
          {...props}
        />
      </form>
    </>
  );
});

export default InputSearch;
