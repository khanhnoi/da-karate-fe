import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes, { string } from 'prop-types';
import {
  postData,
  getTakenData,
  getDataByID, putData
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
  GET_CLUB_BRANCH,
  GET_COURSE_DETAIL,
  UPDATE_COURSE
} from '../../constants/config';
import GroupEbookSmall from '../../component/common/GroupEbookSmall';
import close from '../../assets/images/images/delete.png';

class EditCourse extends Component {
  constructor(props) {
    super(props);
    this.documents = [];
    this.state = {
      courseDetail: [],
      status: false,
      errors: [],
      listBranch: [],
      listBranchAll: [],
      idBranch: 0,
      listClub: [],
      listClubAll: [],
      listBelt: [],
      isChangeBranch: 0,
      arrDelete: [],
      numFiles: [],
      urlFiles: {
      }
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
      const dataNew = res && res.data;
      this.setState({
        listBranch: dataNew
      })
      dataNew.push({ id: 0, name: "Tất cả phân đường" })
      this.setState({
        listBranchAll: dataNew
      })
    });
  };
  handleChangeBranch = () => {
    this.setState({
      isChangeBranch: this.state.isChangeBranch + 1
    })
  }
  getListClub = async (id) => {
    await getTakenData(`${GET_CLUB_BRANCH}/${id}`).then((res) => {
      const dataNew = res && res.data;
      this.setState({
        listClub: dataNew
      })
      dataNew.push({ id: 0, name: "Tất cả câu lạc bộ" });
      this.setState({
        listClubAll: dataNew
      })
    });
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
    let inputDeleteElm = document.querySelector(`#div-${id}`)
    if (inputDeleteElm) {
      inputDeleteElm.innerHTML = "";
      this.setState({
        arrDelete: [...this.state.arrDelete, id]
      })
    }
    return;
  };

  onSubmit = () => {
    const { user, history, match } = this.props;
    const idCourse = match && match.params && match.params.id;
    const { numFiles, urlFiles } = this.state;

    const idUser = user && user.user && user.user.id;
    const title = this.nameRef.value;
    const par_conditions = this.IDBeltRef.value;
    const organized_by_branch = this.IDBranchRef.value == 0 ? null : this.IDBranchRef.value;
    const organized_by_club = this.IDClubRef && this.IDClubRef.value == 0 ? null : this.IDClubRef.value;
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


    putData(UPDATE_COURSE, idCourse, formData)
      .then((res) => {
        createNotification('success', `Bạn đã chỉnh sửa thành công khoá học ${title}`);
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

  getCourseDetail = () => {
    const { match } = this.props;
    const idCourse = match && match.params && match.params.id;
    return getDataByID(GET_COURSE_DETAIL, idCourse).then((res) => {
      this.setState({
        courseDetail: res && res.data
      })
      const attach_files_fetch = res && res.data && res.data.attach_files;
      if (attach_files_fetch.length > 0) {
        this.setState({
          numFiles: [...res && res.data && res.data.attach_files]
        });
        let urlFilesTemp = {};
        for (let i = 0; i < attach_files_fetch.length; i++) {
          urlFilesTemp = { ...urlFilesTemp, [i]: [attach_files_fetch[i].file] }
        }
        this.setState({
          urlFiles: urlFilesTemp
        });
      }
      else {
        // default one input
        this.setState({
          numFiles: [
            {
              file: "",
              title: "",
            }
          ]
        });
      }
      this.getListClub(res && res.data && res.data.branchInfo && res.data.branchInfo.id);
    });
  }

  componentDidMount = () => {
    this.getListBelt();
    this.getListBranch();
    this.getCourseDetail();
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.isChangeBranch !== prevState.isChangeBranch) {
      this.getListClub(this.IDBranchRef.value);
    }
  }
  render() {
    const {
      errors,
      listClub,
      listClubAll,
      listBranch,
      listBelt,
      numFiles,
      courseDetail,
      isChangeBranch
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
                Chỉnh Sử Khoá Học
            </div>
            </div>

            <div className="content-form">
              <div className="row">
                <div className="col-md-12 content-title">
                  <p>Chỉnh Sửa Khoá Học</p>
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
                      defaultValue={courseDetail && courseDetail.title}
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
                      defaultValue={courseDetail && courseDetail.beltInfo}
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
                      defaultValue={courseDetail && courseDetail.branchInfo && courseDetail.branchInfo.id > 0 ? courseDetail.branchInfo : { id: 0, name: "Tất cả phân đường" }}
                    />
                    <InputText
                      className="form-control input-form"
                      placeholder=""
                      name="duration"
                      ref={r => { this.durationRef = r }}
                      label="Thời Gian Dự Kiến : "
                      errors={errors}
                      type="text"
                      defaultValue={courseDetail && courseDetail.duration}
                    />
                  </div>

                  <div className="col-md-6">
                    {(listClub && listClubAll) ? (
                      <Select
                        label=""
                        className="form-control input-form form-control-product mb-3 input-grey"
                        name="branch_id"
                        ref={r => { this.IDClubRef = r }}
                        errors={errors}
                        key_value="id"
                        key_label="name"
                        include_blank="Tất cả câu lạc bộ"
                        include_blank={listClub.length > 0 ? "" : "Tất cả câu lạc bộ"}
                        data={courseDetail && courseDetail.clubInfo && courseDetail.clubInfo.id > 0 ? listClubAll : listClub}
                        defaultValue={courseDetail && courseDetail.clubInfo && courseDetail.clubInfo.id > 0 ? (isChangeBranch == 0 ? courseDetail.clubInfo : {id: 0, name: "Tất cả câu lạc bộ" }) : {id: 0, name: "Tất cả câu lạc bộ" }}
                        />
                      ) : null}
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
                              defaultValue={item.title || ""}
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
                              default={item.file != '' ? [item.file] : []}
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
                      defaultValue={courseDetail && courseDetail.course_overview}
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

EditCourse.propTypes = {
  history: PropTypes.func.isRequired,
  user: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(EditCourse));
