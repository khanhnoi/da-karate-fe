import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import upload from '../../assets/images/upload-kn.png';
import defaultIMG from '../../assets/images/image.svg';


const UploadImgClb = (props) => {
    const { label } = props;
    
    return (
        <>
            <div className="form-group form-add-box">
                <p>{label}</p>
                <div className="form-add-box-img">
                    <img src={upload} alt="" />
                </div>
            </div>
        </>
    );
};

export default withRouter(UploadImgClb);

UploadImgClb.propTypes = {
    label: PropTypes.isRequired
};
