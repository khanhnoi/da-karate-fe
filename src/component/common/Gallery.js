/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Gallery from 'react-grid-gallery';

const Gallerys = props => {
  let { data, numToShow, className } = props;
  if (!Array.isArray(data)) return '';

  data = data.map((item) => {
    return {
      src: item,
      thumbnail: item,
      caption: item
    }
  });

  return (
      <div className="light-box_wrraper">
        <Gallery images={data} showLightboxThumbnails={true} rowHeight={90} style={{width: '90px'}} maxRows={1} enableImageSelection={false}/>
      </div>
  );
}

Gallery.propTypes = {
  data: PropTypes.array.isRequired,
  numToShow: PropTypes.number.isRequired
};

export default Gallerys;

Gallerys.propTypes = {
  data: PropTypes.isRequired,
  numToShow: PropTypes.isRequired,
  className: PropTypes.isRequired,
};
