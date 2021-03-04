import React, { Component } from 'react';
import {
  getError,
  checkErrorSingle,
  checkErrorMultikey
} from '../../helpers/error';
import { uploadDocument } from '../../helpers/form';
import Alert from './Alert';
import close from '../../assets/images/close.png';
import attach from '../../assets/images/upload.png';
import { BASE_IMG } from '../../constants/config';
import { showMessage } from '../../helpers/table';
import upload from '../../assets/images/up-arrow.svg';

class GroupFile extends Component {
  constructor(props, context) {
    super(props, context);
    props.onChange(props.default);
    this.state = {
      loading: false,
      data: props.default,
      error: {}
    };
  }

  checkVideo = (item) => {
    const temp = ['flv', 'wmv', 'mov', 'mp4'];
    if (item && temp.includes(item.split('.').splice(-1, 1)[0].toLowerCase())) {
      return true;
    }
    return false;
  };

  onChangeImage = (e) => {
    const { data } = this.state;
    const file = e.target.files[0];
    if (data.length > 0) {
      showMessage('Mỗi lần chỉ được thêm 1 video', false);
    } else {
      if (file && this.checkVideo(file.name)) {
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
            this.setState({ error: err.error_upload });
            this.setLoading(false);
          });
      } else {
        showMessage('Chỉ nhập video', false);
      }
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
    const { errors, name, label, audio } = this.props;
    const { data, error, loading } = this.state;

    return (
      <div
        className={`${checkErrorMultikey(error, [
          'file',
          name
        ])} ${checkErrorSingle(error, 'file')}`}
      >
        <div className="upload-field up-gr-img">
          <input
            type="file"
            className="upload-input"
            id={`upload-input-${this.props.order}`}
            onChange={(e) => this.onChangeImage(e)}
            onClick={(e) => {
              e.target.value = null;
            }}
          />
          {data.length == 0 ? (
            <>
              <div className="upload-area upload-area-full">
                <img src={upload} alt onClick={this.clickUpload} />
                <p className="upload-area-file">
                  {audio ? (
                    <>
                      <span>Audio</span> Đính kèm
                    </>
                  ) : (
                    <>
                      <span>Video</span> Đính kèm
                    </>
                  )}
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
                  <video
                    className="upload-show-img upload-show-img-max"
                    muted
                    autoPlay
                    loop
                    playsInline
                  >
                    <source
                      src={`${BASE_IMG}${item}`}
                      type={`video/${item
                        .split('.')
                        .splice(-1, 1)[0]
                        .toLowerCase()}`}
                      alt=""
                    />
                  </video>
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

export default GroupFile;
