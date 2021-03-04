import dateFormat from 'dateformat';
import { postDataMultipart } from '../services/base_services';
import { UPLOAD_URL, UPLOAD_FILE } from '../constants/config';
import { destructServerErrors } from './error';
import { showMessage } from '../helpers/table';

export const getFormDataFromRef = (refs) => {
  let data = [];
  data = Object.keys(refs).map((item) => {
    return {
      ...data,
      [item]:
        refs[item].type === 'checkbox' ? refs[item].checked : refs[item].value
    };
  });

  return Object.assign({}, ...data);
};

export const formatDate = (date, format = 'dd-mm-yyyy') => {
  if (!date) {
    return '';
  }
  const newDate = new Date(date);
  return dateFormat(newDate, format);
};

export const uploadAvatar = async (file) => {
  const defaulImg = 'assets/img/icons/image.svg';
  if (file) {
    const formData = new FormData();
    formData.append('image', file);
    return postDataMultipart(UPLOAD_URL, formData)
      .then(({ data: { src } }) => {
        return Promise.resolve({
          status: true,
          src,
          errorUpload: {}
        });
      })
      .catch((err) => {
        const errorUpload = destructServerErrors(err);
        return Promise.reject(
          new Error({
            status: false,
            file: defaulImg,
            errorUpload
          })
        );
      });
  }
  return '';
};

export const uploadDocument = async (file) => {
  if (file) {
    const formData = new FormData();
    formData.append('files', file);
    return postDataMultipart(UPLOAD_FILE, formData)
      .then((res) => {
        return Promise.resolve({
          data: res.data
        });
      })
      .catch((err) => {
        showMessage("Lỗi sai định dạng ảnh", false);
        const errorUpload = destructServerErrors(err);
        return Promise.reject(
          new Error({
            errorUpload
          })
        );
      });
  }
  return '';
};

export const uploadFile = async (file) => {
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    return postDataMultipart(UPLOAD_FILE, formData)
      .then((res) => {
        return Promise.resolve({
          data: res.data
        });
      })
      .catch((err) => {
        const errorUpload = destructServerErrors(err);
        return Promise.reject(
          new Error({
            errorUpload
          })
        );
      });
  }
  return '';
};
