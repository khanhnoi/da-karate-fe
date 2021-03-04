import React, { useState, useRef, useEffect } from 'react';
import Checkbox from '../../component/common/Checkbox';
import { editBranch } from '../../actions/branch';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import UploadImg from '../../component/common/UploadImg';
import { postData, getDataByID, putData } from '../../services/base_services';
import { GET_BRANCH_REQUEST } from '../../constants/config';
import createNotification from '../../component/common/Notifications';
import InputText from '../../component/common/InputText';
import { destructServerErrors } from '../../helpers/error';
import TextArea from '../../component/common/TextArea';
import ButtonSave from '../../component/common/ButtonSave';
import { Link } from 'react-router-dom';

const AddBranch = (props) => {
  const [branchDetail, setBranchDetail] = useState(null);
  const [bgrImage, setBgrImage] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const branch_leader = useRef(null);
  const name = useRef(null);
  const email = useRef(null);
  const is_sendmail = useRef(null);
  const intro_branch = useRef(null);
  const isAddPage = props.match.params.type === 'new';
  const id = props.match.params.id;
  const { history } = props;

  useEffect(() => {
    if (id) {
      getBranchDetail(id);
    } else {
      setLoading(false);
    }
  }, []);

  const getBranchDetail = (id) => {
    return getDataByID(GET_BRANCH_REQUEST, id)
      .then((res) => {
        setBranchDetail(res.data);
        if (res.data.bgr_image) {
          setBgrImage([res.data.bgr_image]);
        }
        setPhotos(res.data.photos);
        setLoading(false);
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

  const handleSubmit = () => {
    if (isAddPage) {
      const data = {
        name: name.current.value,
        bgr_image: bgrImage,
        intro_branch:
          intro_branch && intro_branch.current && intro_branch.current.value
      };
      postData(GET_BRANCH_REQUEST, data)
        .then((res) => {
          if (res.status === 201) {
            history.push('/statistical/branch');
            return createNotification('success', res.data.message);
          }
          return createNotification('error', res.data.message);
        })
        .catch((err) => {
          const errss = destructServerErrors(err);
          setErrors(errss);
          if (err.response.status == 422) {
            return null;
          }
          return createNotification('error', err.message);
        });
    } else {
      const data = {
        name: name.current.value,
        intro_branch:
          intro_branch && intro_branch.current && intro_branch.current.value,
        bgr_image: bgrImage
      };
      putData(GET_BRANCH_REQUEST, id, data)
        .then((res) => {
          if (res.status === 200) {
            history.push('/statistical/branch');
            return createNotification('success', res.data.message);
          }
          return createNotification('error', res.data.message);
        })
        .catch((err) => {
          const errss = destructServerErrors(err);
          setErrors(errss);
          if (err.response.status == 422) {
            return null;
          }
          return createNotification('error', err.message);
        });
    }
  };

  const onChangeDocument = (e) => {
    setBgrImage(e);
  };

  return isLoading ? (
    ''
  ) : (
    <>
      <section className="body-right-bottom">
        <div className="container-fluid content">
          <div className="row top-table">
            <div className="col-md-12 top-table-title">
              <p>Quản Lý Phân đường </p>
            </div>
            <div className="col-md-1 top-table-border "></div>
            <div className="col-md-12 top-table-text">
              {isAddPage ? 'Thêm Phân Đường Mới' : 'Cập Nhật Phân Đường'}
            </div>
          </div>
          <div className="content-form">
            <div className="row">
              <div className="col-md-12 content-title">
                <p>{isAddPage ? 'Thêm Phân Đường ' : 'Sửa Phân Đường'}</p>
              </div>
            </div>
            <div className="row form-add">
              <div className="col-md-6">
                <div className="form-add-title">
                  <p>Thông Tin Phân Đường</p>
                </div>
                <InputText
                  className="form-control input-form"
                  placeholder="Tên phân đường "
                  name="name"
                  ref={name}
                  label="Tên phân đường (*) : "
                  errors={errors}
                  type="text"
                  defaultValue={branchDetail && branchDetail.name}
                />
              </div>
            </div>

            <div className="row form-add">
              <div className="col-md-6">
                <style jsx>
                  {`
                    textarea.input-form.form-control {
                      height: 100%;
                      max-height: 400px;
                      overflow-y: hidden;
                    }
                  `}
                </style>
                <TextArea
                  className="form-control input-form"
                  placeholder="Khái quát về phân đường"
                  name="intro_branch"
                  ref={intro_branch}
                  label="Khái quát về phân đường  :"
                  errors={errors}
                  defaultValue={''}
                  type="textarea"
                  defaultValue={branchDetail && branchDetail.intro_branch}
                />
              </div>
              <div className="col-md-6">
                <label className="input-label">Ảnh Bìa</label>
                <div className="form-add-box-img">
                  <UploadImg
                    label="Thêm ảnh bìa"
                    name="bgr_image"
                    title="Chọn ảnh để tải"
                    onChange={onChangeDocument}
                    errors={[]}
                    default={bgrImage}
                  />
                </div>
              </div>
              <div className="col-md-12 mt-4 ">
                <div className="form-add-buttons">
                  <ButtonSave
                    onClick={() => handleSubmit()}
                    text="Lưu thông tin"
                    className="btn btn-new ml-0"
                  />
                  <Link to="/statistical/branch">
                    <ButtonSave text="Hủy" className="btn btn-cancel" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

AddBranch.propTypes = {
  match: PropTypes.isRequired,
  history: PropTypes.isRequired
};

export default withRouter(AddBranch);
