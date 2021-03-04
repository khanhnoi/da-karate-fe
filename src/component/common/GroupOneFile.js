import React, { Component } from 'react';
import {
  getError,
  checkErrorSingle,
  checkErrorMultikey
} from '../../helpers/error';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { uploadDocument } from '../../helpers/form';
import Alert from './Alert';
import close from '../../assets/images/close.png';
import attach from '../../assets/images/upload.png';
import upload from '../../assets/images/up-arrow.svg';
import { BASE_IMG } from '../../constants/config';

class GroupFileCasorel extends Component {
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

  checkVideo = (item) => {
    const temp = ['flv', 'wmv', 'mov', 'mp4'];
    if (item && temp.includes(item.split('.').splice(-1, 1)[0].toLowerCase())) {
      return true;
    }
    return false;
  };

  onChangeImage = (e) => {
    const file = e.target.files[0];
    this.removeImage(0);
    this.setLoading(true);
    uploadDocument(file)
      .then((res) => {
        const data = `${res.data.attach_files}`;
        const image = [...this.state.data, data];
        this.setState({ data: image, error: {} });
        this.props.onChange(image);
        this.setLoading(false);
      })
      .catch((err) => {
        this.setState({ error: err.error_upload });
        this.setLoading(false);
      });
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
    const item = data[0];
    return (
      <div
        className={`${checkErrorMultikey(error, [
          'file',
          name
        ])} ${checkErrorSingle(error, 'file')}`}
      >
        <div className="upload-field up-gr-img">
          {label && <label className="input-label">{label}</label>}
          <button
            className={`btn btn-upload btn-upload${this.props.order} `}
            id="upload-label_2"
            disabled={loading}
            onClick={this.clickUpload}
          >
            {loading ? (
              <i className="ml-1 fas fa-circle-notch fa-spin text-white" />
            ) : (
                <img
                  className="icon-upload"
                  src={attach}
                  style={{ maxWidth: '24px' }}
                />
              )}
          </button>
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
              <div className="upload-area">
                <img src={upload} alt onClick={this.clickUpload} />
                <p className="upload-area-file">
                  <span>File</span> Đính kèm
                </p>
              </div>
            </>
          ) : (
              <>
                <div className="upload-area-list d-flex justify-content-center">
                  <div className="upload-area-list-item">
                    {this.checkVideo(item) ? (
                      <a
                        href={`${BASE_IMG}${item}`}
                        data-fancybox="images"
                        className="fancy-box"
                      >
                        <video
                          className="upload-show-img"
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
                    ) : this.checkImage(item) ? (
                      <a
                        href={`${BASE_IMG}${item}`}
                        data-fancybox="images"
                        className="fancy-box"
                      >
                        <img
                          src={`${BASE_IMG}${item}`}
                          className="upload-show-img"
                        />
                      </a>
                    ) : (
                          <>
                            <a
                              href={`${BASE_IMG}${item}`}
                              target="_blank"
                            >
                              <div className="icon-file">
                                <FileIcon
                                  extension={item
                                    .split('.')
                                    .splice(-1, 1)[0]
                                    .toLowerCase()}
                                  {...defaultStyles[
                                  item
                                    .split('.')
                                    .splice(-1, 1)[0]
                                    .toLowerCase()
                                  ]}
                                />
                              </div>
                            </a>
                          </>
                        )}
                    <div className="remove-custom remove-custom-caso">
                      <span
                        className="remove"
                        onClick={() => this.removeImage(0)}
                      >
                        <img src={close} />
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
        </div>
        <Alert messsage={getError(errors, name)} />
        <Alert messsage={getError(error, 'file')} />
      </div>
    );
  }
}

export default GroupFileCasorel;
