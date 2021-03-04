import React, { Component } from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import {
  getError,
  checkErrorSingle,
  checkErrorMultikey
} from '../../helpers/error';
import { uploadDocument, sizeOf } from '../../helpers/form';
import Alert from './Alert';
import close from '../../assets/images/close.png';
import { BASE_IMG } from '../../constants/config';
import upload from '../../assets/images/up-arrow.svg';
import { showMessage } from '../../helpers/table';
class UploadImg extends Component {
  constructor(props, context) {
    super(props, context);
    props.onChange(props.default);
    this.state = {
      loading: false,
      data: props.default,
      error: {}
    };
  }

  checkImage = (item) => {
    const temp = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
    if (item && temp.includes(item.split('.').splice(-1, 1)[0].toLowerCase())) {
      return true;
    }
    return false;
  };

  onChangeImage = (e) => {
    const file = e.target.files[0];
    if (file && this.checkImage(file.name)) {
      this.setLoading(true);
      uploadDocument(file)
        .then((res) => {
          const data = `${res.data.attach_files}`;
          const image = [data, ...this.state.data];
          this.setState({ data: image, error: {} });
          this.props.onChange(image);
          this.setLoading(false);
        })
        .catch((err) => {
          this.setLoading(false);
        });
    } else {
      showMessage('Vui lòng nhập đúng định dạng file ảnh', false);
    }
  };

  setLoading = (status) => {
    this.setState({
      loading: status
    });
  };

  clickUpload = () => {
    document.querySelector(`#upload-input-${this.props.order}`).click();
  };

  removeImage = (key) => {
    const { data } = this.state;
    window._.remove(data, function (n, index) {
      return index == key;
    });

    this.setState({ data: [...data] });
    this.props.onChange([...data]);
  };

  render() {
    const { errors, name, label } = this.props;
    const { data, error, loading } = this.state;
    const firstItem = data[0];

    return (
      <div
        className={`${checkErrorMultikey(error, [
          'file',
          name
        ])} ${checkErrorSingle(error, 'file')}`}
      >
        <div className="upload-field up-gr-img upload-field--custom">
          <input
            type="file"
            className="upload-input"
            id={`upload-input-${this.props.order}`}
            onChange={(e) => this.onChangeImage(e)}
            onClick={(e) => {
              e.target.value = null;
            }}
          />
          {loading ? (
            ''
          ) : data.length == 0 ? (
            <>
              <div className="upload-area upload-area-full upload-area-full-gr">
                <img src={upload} alt onClick={this.clickUpload} />
                <p className="upload-area-file">
                  <span>File</span> Đính kèm
                </p>
              </div>
            </>
          ) : (
            data.map((item, index) => (
              <>
                <a
                  data-fancybox="images"
                  href={`${BASE_IMG}${item}`}
                  key={index}
                  className="fancy-box"
                >
                  <img
                    src={`${BASE_IMG}${item}`}
                    className="upload-show-img upload-show-img-max"
                  />
                </a>
                <div className="remove-custom">
                  <span
                    className="remove"
                    onClick={() => this.removeImage(index)}
                  >
                    <img src={close} />
                  </span>
                </div>
              </>
            ))
          )}
        </div>
        <Alert messsage={getError(errors, name)} />
        <Alert messsage={getError(error, 'file')} />
      </div>
    );
  }
}

export default UploadImg;
