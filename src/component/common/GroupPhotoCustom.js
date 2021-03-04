/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { checkError, getError, checkErrorMultikey } from '../../helpers/error';
import { uploadAvatar } from '../../helpers/form';
import defaultIMG from '../../assets/images/image.svg';
import upload from '../../assets/images/up-arrow.svg';
import { BASE_IMG, BASE_IMG_TMP } from '../../constants/config';
import { showMessage } from '../../helpers/table';

const UploaderAvatarStudent = React.forwardRef((props, ref) => {
  const {
    errors,
    defaultValue,
    label,
    name,
    order,
    addImage,
    ...input
  } = props;
  const default_img = defaultValue ? `${BASE_IMG}${defaultValue}` : defaultIMG;

  const [image, setImage] = useState(default_img);
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState(errors);

  const checkImage = (item) => {
    const temp = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
    if (item && temp.includes(item.split('.').splice(-1, 1)[0].toLowerCase())) {
      return true;
    }
    return false;
  };

  const onChangeImage = (e) => {
    const file = e.target.files[0];
    if (file && checkImage(file.name)) {
      if (file) {
        setLoading(true);
        uploadAvatar(file)
          .then((res) => {
            setImage(`${BASE_IMG}${res.src}`);
            setValue(res.src);
            setErrors(res.error_upload);
            addImage(order, res.src);
            setLoading(false);
            if (document.querySelector(`#div-${order}`)) {
              document.querySelector(`#div-${order}`).className =
                'upload-img-area';
            }
          })
          .catch((err) => {
            setErrors(err.error_upload);
            setLoading(false);
          });
      }
    } else {
      showMessage('Chỉ nhập ảnh ', false);
    }
  };

  const clickUpload = () => {
    document.querySelector(`#upload-input-${order}`).click();
  };

  return (
    <div className={checkErrorMultikey(error, ['file', name])}>
      {label && <label className="input-label">{label}</label>}
      <form className="d-flex flex-wrap" id={`form-image${order}`}>
        <div className="preview-img-avatar preview-img-avatar-student preview-img-avatar-border preview-img-avatar-border-group">
          {image == defaultIMG ? (
            <div className="upload-area upload-area-full" id={`div-${order}`}>
              <img src={upload} alt onClick={clickUpload} id={`img-${order}`} />
            </div>
          ) : (
            <div className="upload-img-area" id={`div-${order}`}>
              <img
                className="image"
                src={`${image}`}
                onClick={clickUpload}
                id={`img-${order}`}
              />
            </div>
          )}
        </div>
        <div className="preview-img-input preview-img-input-lib preview-img-input-student d-flex flex-wrap">
          {loading && <div id="uploading" />}
          <input
            type="file"
            className="upload-file"
            id={`upload-input-${order}`}
            onChange={(e) => onChangeImage(e)}
          />
          <input type="hidden" ref={ref} value={value} />
        </div>
      </form>
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
