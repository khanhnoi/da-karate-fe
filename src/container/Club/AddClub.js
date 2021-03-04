import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import createNotification from '../../component/common/Notification';
import { NEW_CLUB_REQUEST, GET_LIST_BRANCH } from '../../constants/config';
import { postData, getTakenData } from '../../services/base_services';
import Select from '../../component/common/Select';
import Checkbox from '../../component/common/Checkbox';
import TextArea from '../../component/common/TextArea';
import UploadImgClb from './UploadImgClb';
import UploadImg from '../../component/common/UploadImg';
import ButtonSave from '../../component/common/ButtonSave';
import InputText from '../../component/common/InputText';
import { destructServerErrors } from '../../helpers/error';

const AddClub = (props) => {
  const { history } = props;
  let formData = {};
  const nameRef = useRef('');
  const nameLeaderRef = useRef('');
  const emailRef = useRef('');
  const IDBranchRef = useRef('');
  const descriptionRef = useRef('');
  const bgRef = useRef('');
  const [isCheck, setIsCheck] = useState(false);
  const [listBranch, setListBranch] = useState([]);
  const [errors, setErrors] = useState([]);
  const [bgrImage, setBgrImage] = useState([]);
  const [photos, setPhotos] = useState([]);

  const onSubmit = () => {
    const name = nameRef.current.value;
    const nameLeader = nameLeaderRef.current.value;
    const email = emailRef.current.value;
    const IDBranch = IDBranchRef.current.value;
    const description = descriptionRef.current.value;
    const bgClb = bgRef.current.value || '';
    {
      formData = {
        name: name,
        club_leader: nameLeader,
        email: email,
        is_sendmail: isCheck,
        bgr_image: bgClb,
        branch_id: IDBranch,
        intro_club: description,
        bgr_image: bgrImage,
      };
      postData(NEW_CLUB_REQUEST, formData)
        .then((res) => {
          createNotification('success', `Bạn đã thêm thành công Clb ${name}`);
          setErrors('');
          history.push('/statistical/club');
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
  const onCheck = () => {
    setIsCheck(!isCheck);
  };
  const getListBranch = async () => {
    await getTakenData(GET_LIST_BRANCH).then((res) => {
      setListBranch(res && res.data);
    });
  };
  const onChangeDocument = (e) => {
    setBgrImage(e);
  };
  useEffect(() => {
    getListBranch();
  }, []);
  return (
    <>
      <section className="body-right-bottom">
        <div className="container-fluid content">
          <div className="row top-table">
            <div className="col-md-12 top-table-title">
              <p>Quản Lý Câu Lạc Bộ </p>
            </div>
            <div className="col-md-1 top-table-border "></div>
            <div className="col-md-12 top-table-text">Thêm Mới Câu Lạc Bộ</div>
          </div>

          <div className="content-form">
            <div className="row">
              <div className="col-md-12 content-title">
                <p>Thêm Câu Lạc Bộ Mới</p>
              </div>
            </div>
            <div className="row form-add">
              <div className="col-md-12">
                <div className="form-add-title">
                  <p>Thông Tin Câu Lạc Bộ</p>
                </div>
              </div>

            </div>
            <div className="row">
              <div className="col-md-6">
                <InputText
                  className="form-control input-form"
                  placeholder="Tên câu lạc bộ"
                  name="name"
                  ref={nameRef}
                  label="Tên câu lạc bộ (*) : "
                  errors={errors}
                  type="text"
                />
              </div>

              <div className="col-md-6">
                <Select
                  label="Thuộc Phân Đường (*) :"
                  className="form-control input-form form-control-product mb-3 input-grey"
                  name="branch_id"
                  ref={IDBranchRef}
                  errors={errors}
                  key_value="id"
                  key_label="name"
                  include_blank="Phân Đường"
                  data={listBranch}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <style jsx>
                  {`
                    textarea.input-form.form-control {
                      height: 100%;
                      max-height: 300px;
                      overflow-y: hidden;
                    }
                  `}
                </style>
                <TextArea
                  className="form-control input-form"
                  placeholder="Khái quát về câu lạc bộ"
                  name="description"
                  ref={descriptionRef}
                  label="Khái quát về câu lạc bộ :"
                  errors={errors}
                  defaultValue={''}
                  type="textarea"
                />
              </div>
              <div className="col-md-6">
                <label className="input-label">Ảnh Bìa</label>
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

            <div className="row">
              <div className="col-12  mt-4">
                <div className="form-add-buttons">
                  <ButtonSave
                    onClick={() => onSubmit()}
                    text="Lưu thông tin"
                    className="btn btn-new ml-0"
                  />
                  <Link to="/statistical/club">
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

export default withRouter(AddClub);

AddClub.propTypes = {
  history: PropTypes.isRequired
};
