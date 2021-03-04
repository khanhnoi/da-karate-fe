import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
  postData,
  getTakenData,
  getDataByID,
} from '../../services/base_services';
import ButtonSave from '../../component/common/ButtonSave';
import InputText from '../../component/common/InputText';
import TextArea from '../../component/common/TextArea';
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
  GET_LIST_BRANCH,
  GET_ALL_BELT,
  GET_CLUB_BRANCH
} from '../../constants/config';
import GroupEbookSmall from '../../component/common/GroupEbookSmall';
import close from '../../assets/images/images/delete.png';

class AddCourse extends Component {
  constructor(props) {
    super(props);
    this.documents = [];
    this.state = {
      status: false,
      errors: [],
      listBranch: [],
      idBranch: 0,
      listClub: [],
      listBelt: [],
      isChangeBranch: 0,
      arrDelete: [],
      numFiles: [
        {
          file: "",
          title: "",
        }
      ],
      urlFiles: {}
    };
  }



  //test add course
  getListBelt = async () => {
    await getTakenData(GET_ALL_BELT).then((res) => {
      this.setState({
        listBelt: res && res.data
      })
    });
  };
  getListBranch = async () => {
    await getTakenData(GET_LIST_BRANCH).then((res) => {
      this.setState({
        listBranch: res && res.data
      })
    });
  };
  handleChangeBranch = () => {
    const organized_by_branch = this.IDBranchRef.value;
    this.getListClub(organized_by_branch);
  }
  getListClub = async (id) => {
    if (id > 0)
      await getTakenData(`${GET_CLUB_BRANCH}/${id}`).then((res) => {
        this.setState({
          listClub: res && res.data
        })
      });
    else this.setState({
      listClub: []
    })
  };

  handleAddInput = () => {
    const { numFiles } = this.state;
    const temp = {
      title: "",
      file: ""
    };
    this.setState({
      numFiles: [...numFiles, temp]
    });
  };

  deleteFile = (e, id) => {
    e.preventDefault();
    let inputDeleteElm =  document.querySelector(`#div-${id}`)
    if (inputDeleteElm) {
      inputDeleteElm.innerHTML = "";
      this.setState({
        arrDelete: [...this.state.arrDelete, id]
      })
    }
    return;
  };

  onSubmit = () => {
    const { user, history } = this.props;
    const { numFiles, urlFiles } = this.state;

    const idUser = user && user.user && user.user.id;
    const title = this.nameRef.value;
    const par_conditions = this.IDBeltRef.value;
    const organized_by_branch = this.IDBranchRef.value === "" ? null : this.IDBranchRef.value;
    const organized_by_club = this.IDClubRef && this.IDClubRef.value === "" ? null : this.IDClubRef.value;
    const course_overview = this.descriptionRef.value;
    const duration = this.durationRef.value;

    const dataFile = getFormDataFromRef(this.refs);

    let attach_files = []
    numFiles.map((item, index) => {
      attach_files = [
        ...attach_files,
        {
          file: urlFiles[index].length === 0 ? "" : urlFiles[index][0],
          title: dataFile[`indexText${index}`]
        }
      ];
    })
   
    for (let i = 0; i < this.state.arrDelete.length; i++) {
      attach_files.splice(this.state.arrDelete[i], 1, 'file was delete');
    }
    let attach_files_select = attach_files.filter(item => item !== 'file was delete')
    
    const formData = {
      title,
      par_conditions,
      organized_by_branch,
      organized_by_club,
      duration,
      created_by: idUser,
      is_sendnotify: false,
      course_overview,
      num_lesson: attach_files.length - this.state.arrDelete.length || 0,
      attach_files: attach_files_select,
      status: 2,

    };
    

    postData(NEW_COURSE_REQUEST, formData)
      .then((res) => {
        createNotification('success', `Bạn đã thêm thành công khoá học ${title}`);
        this.setState({
          errors: ''
        })
        history.push('/active/course');
      })
      .catch((err) => {
        const errss = destructServerErrors(err);
        this.setState({
          errors: errss
        })
        if (err.response.status == 422) {
          return null;
        }
        return createNotification('error', err.message);
      });

  };

  componentDidMount = () => {
    this.getListBelt();
    this.getListBranch();
  };

  render() {
    const {
      errors,
      listClub,
      listBranch,
      listBelt,
      numFiles
    } = this.state;
    const { history, location } = this.props;
    const id = location && location.query && location.query.log_id;
    return (
      <>
        <section className="body-right-bottom">
          <div className="container-fluid content course">
            <div className="row top-table">
              <div className="col-md-12 top-table-title">
                <p>Quản Lý Khoá Học </p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">
                Thêm Mới Khoá Học
            </div>
            </div>

            <div className="content-form">
              <div className="row">
                <div className="col-md-12 content-title">
                  <p>Tạo Khoá Học Mới</p>
                </div>
              </div>
              <div className="form-add">
                <div className="row">
                  <div className="col-md-12">
                    <InputText
                      className="form-control input-form"
                      placeholder=""
                      name="title"
                      ref={r => { this.nameRef = r }}
                      label="Tên khoá học (*): "
                      errors={errors}
                      type="text"
                    />
                  </div>

                  <div className="col-md-6">
                    <Select
                      label="Điều kiện đăng ký của võ sinh (*):"
                      className="form-control input-form mb-3 input-blu"
                      name="par_conditions"
                      ref={r => { this.IDBeltRef = r }}
                      errors={errors}
                      key_value="id"
                      key_label="name"
                      include_blank="Điều kiện đăng ký"
                      data={listBelt}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="form-add-title form-add-title--small"><p>Đối tượng tham gia :</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <Select
                      label=""
                      className="form-control input-form form-control-product mb-3 input-grey"
                      name="branch_id"
                      ref={r => { this.IDBranchRef = r }}
                      errors={errors}
                      key_value="id"
                      key_label="name"
                      include_blank=""
                      data={listBranch}
                      include_blank="Tất cả phân đường"
                      onChange={this.handleChangeBranch}
                    />
                    <InputText
                      className="form-control input-form"
                      placeholder=""
                      name="duration"
                      ref={r => { this.durationRef = r }}
                      label="Thời Gian Dự Kiến : "
                      errors={errors}
                      type="text"
                    />
                  </div>

                  <div className="col-md-6">
                    <Select
                      label=""
                      className="form-control input-form form-control-product mb-3 input-grey"
                      name="branch_id"
                      ref={r => { this.IDClubRef = r }}
                      errors={errors}
                      key_value="id"
                      key_label="name"
                      include_blank="Tất cả câu lạc bộ"
                      data={listClub}
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
                        <p>
                          {errors.attach_files}
                        </p>
                      </div>
                    ) : null}

                    {numFiles.map((item, index) => (
                      <>
                        <div className="row position-relative" key={index} id={`div-${index}`}>
                          <div className="col-md-6" >


                            <InputText
                              className="form-control input-form course-custom-input"
                              placeholder="Nhập tên bài"
                              name={`indexText${index}`}
                              ref={`indexText${index}`}
                              label="Tên Bài : "
                              errors={errors}
                              type="text"
                              order={index}
                            />

                          </div>
                          <div className="col-md-6" >
                            <GroupEbookSmall
                              label="Tài liệu :"
                              title="Chọn file để tải"
                              name={`fileIndex${index}`}
                              ref={`fileIndex${index}`}
                              errors={errors}
                              onChange={data => this.setState({
                                urlFiles: { ...this.state.urlFiles, [index]: data }
                              })}
                              default={[]}
                              order={index}
                            />
                          </div>

                          <div className="close-file" onClick={(e) => this.deleteFile(e, index)}>
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


                  <div className="col-12">
                    <TextArea
                      className="form-control input-form-short"
                      placeholder="Tóm tắt"
                      name="course_overview"
                      ref={(c) => {
                        this.descriptionRef = c;
                      }}
                      label="Tóm tắt :"
                      errors={errors}
                      defaultValue={''}
                      type="textarea"
                    />
                  </div>

                  <div className="col-12">
                    <div className="form-add-buttons">
                      <ButtonSave
                        onClick={this.onSubmit}
                        text="Lưu thông tin"
                        className="btn btn-new ml-0"
                      />
                      <ButtonSave onClick={history.goBack} text="Hủy" className="btn btn-cancel" />
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

AddCourse.propTypes = {
  history: PropTypes.func.isRequired,
  user: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(AddCourse));
