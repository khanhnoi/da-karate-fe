import React, { Component } from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import {
  getError,
  checkErrorSingle,
  checkErrorMultikey
} from '../../helpers/error';
import { uploadDocument } from '../../helpers/form';
import Alert from './Alert';
import close from '../../assets/images/close.png';
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

  checkFiles = (item) => {
    const temp = ['pdf', 'docx', 'doc'];
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
    const { data } = this.state;
    const file = e.target.files[0];
    if (data.length > 0) {
      showMessage('Mỗi lần chỉ được thêm 1 files', false);
    } else {
      if (file && this.checkFiles(file.name)) {
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
        showMessage('Chỉ nhập file pdf hoặc word', false);
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
    const { errors, name, label } = this.props;
    const { data, error, loading, pageNumber } = this.state;

    return (
      <div
        className={`${checkErrorMultikey(error, [
          'file',
          name
        ])} ${checkErrorSingle(error, 'file')}`}
      >
        {label && <label className="input-label">{label}</label>}

        <div className="upload-field up-gr-img upload-field-ebook">
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
                  <span>File</span> Đính kèm
                </p>
              </div>
            </>
          ) : (
            data.map((item, index) => (
              <>
                <a href={`${BASE_IMG}${item}`} key={index} target="_blank">
                  <div className="icon-file">
                    <FileIcon
                      extension={item.split('.').splice(-1, 1)[0].toLowerCase()}
                      {...defaultStyles[
                        item.split('.').splice(-1, 1)[0].toLowerCase()
                      ]}
                    />
                  </div>
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
