import React, { Component } from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import {
  getError,
  checkErrorSingle,
  checkErrorMultikey
} from '../../helpers/error';
import { uploadDocument } from '../../helpers/form';
import Alert from './Alert';
import close from '../../assets/images/images/delete.png';
import { BASE_IMG } from '../../constants/config';
import { showMessage } from '../../helpers/table';
import upload from '../../assets/images/icon/Icon feather-download-kn.svg';
import download from '../../assets/images/icon/downLoad-kn.png';

class GroupFileSmall extends Component {
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
    if (data.length > 10) {
      showMessage('Không tải lại quá nhiều files', false);
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
    const { errors, name, label, order } = this.props;
    const { data, error, loading, pageNumber } = this.state;
    const maxData = data.length;

    return (
      <div
        className={`${checkErrorMultikey(error, [
          'file',
          name
        ])} ${checkErrorSingle(error, 'file')}`}
      >
        {label && <label className="input-label">{label}</label>}

        <div className="upload-field up-gr-img upload-field-ebook" id={`box-file-${order}`} >
          <input
            type="file"
            className="upload-input"
            id={`upload-input-${this.props.order}`}
            onChange={(e) => this.onChangeImage(e)}
            onClick={(e) => {
              e.target.value = null;
            }}
          />
          {data.length === 0 ? (
            <>
              <div className="kn-file-upload" onClick={this.clickUpload}>
                <div className="name-file" id={`name-file-${order}`}>
                  {"Tải Tài Liệu Lên"}
                </div>
                <img src={upload} alt style={{ display: 'none' }} />
              </div>
            </>
          ) : (
              data.map((item, index) => {
                if (index === 0 )
                  return (
                    <>
                      <div className="kn-file-download" >
                        <div className="name-file" id={`name-file-${order}`} >
                          <a href={`${BASE_IMG}${item}`} key={index} target="_blank" id={`link-file-${order}`}>
                            {item.split('/')[item.split('/').length - 1]}
                          </a>
                        </div>
                        <img src={upload} alt onClick={this.clickUpload} />
                      </div>

                      <div className="remove-custom" style={{ display: 'none' }}>
                        <span
                          className="remove"
                          onClick={() => this.removeImage(index)}
                        >
                          <img src={close} />
                        </span>
                      </div>
                    </>
                  )
              })
            )}
        </div>
        <Alert messsage={getError(errors, name)} />
        <Alert messsage={getError(error, 'file')} />
      </div>
    );
  }
}

export default GroupFileSmall;
