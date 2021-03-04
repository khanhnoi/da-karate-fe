/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { checkError, getError, checkErrorMultikey } from '../../helpers/error';
import { uploadAvatar } from '../../helpers/form';
import Alert from './Alert';
import defaultIMG from '../../assets/images/image.svg';
import upload from '../../assets/images/edit.png';
import { BASE_IMG, BASE_IMG_TMP } from '../../constants/config';

const UploaderAvatarStudent = React.forwardRef((props, ref) => {
  const { errors, defaultValue, label, name, order, ...input } = props;
  const default_img = defaultValue ? `${BASE_IMG}${defaultValue}` : defaultIMG;

  const [image, setImage] = useState(default_img);
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState(errors);

  const onChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      uploadAvatar(file)
        .then((res) => {
          setImage(`${BASE_IMG}${res.src}`);
          setValue(res.src);
          setErrors(res.error_upload);
          setLoading(false);
        })
        .catch((err) => {
          setErrors(err.error_upload);
          setLoading(false);
        });
    }
  };

  const clickUpload = () => {
    document.querySelector(`#upload-input-${order}`).click();
  };

  return (
    <div className={checkErrorMultikey(error, ['file', name])}>
      {label && <label className="input-label">{label}</label>}

      <div className="d-flex flex-wrap">
        <div className="preview-img-avatar preview-img-avatar-student ">
          <img className="image" src={`${image}`} onClick={clickUpload} />
        </div>
        <div className="preview-img-input preview-img-input-student d-flex flex-wrap">
          {loading && <div id="uploading" />}
          <input
            type="file"
            className="upload-file"
            id={`upload-input-${order}`}
            onChange={(e) => onChangeImage(e)}
          />
          <input type="hidden" ref={ref} value={value} />
          {defaultValue ? (
            ''
          ) : (
            <label
              className="upload-label"
              id={`upload-label-${order}`}
              onClick={clickUpload}
            >
              Thay đổi ảnh đại diện
              <img src={upload} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
});

export default UploaderAvatarStudent;

UploaderAvatarStudent.propTypes = {
  errors: PropTypes.isRequired,
  defaultValue: PropTypes.isRequired,
  label: PropTypes.isRequired,
  order: PropTypes.isRequired,
  name: PropTypes.isRequired,
  input: PropTypes.isRequired
};