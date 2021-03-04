import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
  postData,
  getTakenData,
  getDataByID
} from '../../services/base_services';
import ButtonSave from '../../component/common/ButtonSave';
import InputText from '../../component/common/InputText';
import {
  destructServerErrors,
  destructServerMessage
} from '../../helpers/error';
import { showMessage } from '../../helpers/table';
import Select from '../../component/common/Select';
import { getFormDataFromRef } from '../../helpers/form';
import { Link } from 'react-router-dom';
import createNotification from '../../component/common/Notification';
import {
  NEW_COURSE_REQUEST,
  GET_ALL_BELT,

} from '../../constants/config';

import close from '../../assets/images/images/delete.png';
import TextEditor from '../../component/common/TextEditor';

class AddExam extends Component {
  constructor(props) {
    super(props);
    this.documents = [];
    this.state = {
      status: false,
      errors: [],
      listBelt: [],
      contextData: [],
      arrDelete: [],
      numExams: [
        {
          typePoint: '',
          title: ''
        }
      ],
      urlFiles: {}
    };
    this.typePoint = [
      {
        id: 0,
        name: 'Thang 10'
      },
      {
        id: 1,
        name: 'Thang A, B, C, D'
      }
    ];
  }

  //test add course
  getListBelt = async () => {
    await getTakenData(GET_ALL_BELT).then((res) => {
      this.setState({
        listBelt: res && res.data
      });
    });
  };




  handleAddInput = () => {
    const { numExams } = this.state;
    const temp = {
      title: '',
      typePoint: ''
    };
    this.setState({
      numExams: [...numExams, temp]
    });
  };

  deleteFile = (e, id) => {
    e.preventDefault();
    let inputDeleteElm = document.querySelector(`#div-${id}`);
    if (inputDeleteElm) {
      inputDeleteElm.innerHTML = '';
      this.setState({
        arrDelete: [...this.state.arrDelete, id]
      });
    }
    return;
  };

  onSubmit = () => {
    // return;
    const { user, history } = this.props;
    const { numExams, contextData } = this.state;

    const idUser = user && user.user && user.user.id;
    const par_conditions = this.IDBeltRef.value;

    const dataFile = getFormDataFromRef(this.refs);

    let attach_files = [];
    numExams.map((item, index) => {
      attach_files = [
        ...attach_files,
        {
          title: dataFile[`indexText${index}`],
          typePoint: dataFile[`typePoint${index}`]
        }
      ];
    });

    for (let i = 0; i < this.state.arrDelete.length; i++) {
      attach_files.splice(this.state.arrDelete[i], 1, 'file was delete');
    }
    let attach_files_select = attach_files.filter(
      (item) => item !== 'file was delete'
    );

    const formData = {
      par_conditions,
      created_by: idUser,
      attach_files: attach_files_select,
      contextData
    };

    return;

    postData(NEW_COURSE_REQUEST, formData)
      .then((res) => {
        createNotification(
          'success',
          `Bạn đã thêm thành công kì thi`
        );
        this.setState({
          errors: ''
        });
        history.push('/active/course');
      })
      .catch((err) => {
        const errss = destructServerErrors(err);
        this.setState({
          errors: errss
        });
        if (err.response.status == 422) {
          return null;
        }
        return createNotification('error', err.message);
      });
  };

  changeEditer = (e, editor) => {
    const data = editor.getData();
    this.setState({
        contextData: data
    })
  };

  componentDidMount = () => {
    this.getListBelt();
  };

  render() {
    const { errors, listClub, listBranch, listBelt, numExams } = this.state;
    const { history, location } = this.props;
    const id = location && location.query && location.query.log_id;
    return (
      <>
        <section className="body-right-bottom">
          <div className="container-fluid content course">
            <div className="row top-table">
              <div className="col-md-12 top-table-title">
                <p>Cài Đặt </p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">Đề Thi</div>
            </div>

            <div className="content-form">
              <div className="row">
                <div className="col-md-12 content-title">
                  <p>Tạo Đề Thi Mới</p>
                </div>
              </div>
              <div className="form-add">
                <div className="row">
                  <div className="col-md-6">
                    <Select
                      label="Loại Kỳ Thi"
                      className="form-control input-form form-control-product mb-3 input-grey"
                      name="branch_id"
                      ref={(r) => {
                        this.IDBeltRef = r;
                      }}
                      errors={errors}
                      key_value="id"
                      key_label="name"
                      include_blank=""
                      data={listBelt}
                      include_blank="Chọn Loại Kỳ Thi"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-add-title form-add-title--small">
                      <p>Bài học :</p>
                    </div>
                    {errors && errors.attach_files ? (
                      <div className="form-add-error">
                        <p>{errors.attach_files}</p>
                      </div>
                    ) : null}

                    {numExams.map((item, index) => (
                      <>
                        <div
                          className="row position-relative"
                          key={index}
                          id={`div-${index}`}
                        >
                          <div className="col-md-6">
                            <InputText
                              className="form-control input-form course-custom-input"
                              placeholder="Nhập tên bài"
                              name={`indexText${index}`}
                              ref={`indexText${index}`}
                              label={`Tên Bài :`}
                              errors={errors}
                              type="text"
                              order={index}
                            />
                          </div>
                          <div className="col-md-6">
                            <Select
                              label="Thang Điểm"
                              className="form-control input-form form-control-product mb-3 input-grey"
                              name={`typePoint${index}`}
                              //   ref={(r) => {
                              //     this.IDBeltRef = r;
                              //   }}
                              ref={`typePoint${index}`}
                              errors={errors}
                              key_value="id"
                              key_label="name"
                              data={this.typePoint}
                              include_blank="Chọn Thang Điểm"
                            />
                            {/* <GroupEbookSmall
                              label="Tài liệu :"
                              title="Chọn file để tải"
                              name={`fileIndex${index}`}
                              ref={`fileIndex${index}`}
                              errors={errors}
                              onChange={(data) =>
                                this.setState({
                                  urlFiles: {
                                    ...this.state.urlFiles,
                                    [index]: data
                                  }
                                })
                              }
                              default={[]}
                              order={index}
                            /> */}
                          </div>

                          <div
                            className="close-file"
                            onClick={(e) => this.deleteFile(e, index)}
                          >
                            <img src={close} />
                          </div>
                        </div>
                      </>
                    ))}
                  </div>

                  <div className="col-12">
                    <ButtonSave
                      onClick={this.handleAddInput}
                      text="Thêm Bài"
                      className="btn btn-new ml-0"
                    />
                  </div>

                  <div className="col-md-12 custom-donate">
                    <TextEditor
                      name="content_notify"
                      label="Nội dung : "
                      errors={errors}
                      onChange={this.changeEditer}
                    />
                  </div>

                  <div className="col-12">
                    <div className="form-add-buttons">
                      <ButtonSave
                        onClick={this.onSubmit}
                        text="Lưu thông tin"
                        className="btn btn-new ml-0"
                      />
                      <ButtonSave
                        onClick={history.goBack}
                        text="Hủy"
                        className="btn btn-cancel"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

AddExam.propTypes = {
  history: PropTypes.func.isRequired,
  user: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(AddExam));
