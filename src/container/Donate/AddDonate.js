import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import ButtonSave from '../../component/common/ButtonSave';
import Datepicker from '../../component/common/Datepicker';
import InputPhone from '../../component/common/InputPhone';
import InputText from '../../component/common/InputText';
import createNotification from '../../component/common/Notification';
import Select from '../../component/common/Select';
import TextEditor from '../../component/common/TextEditor';
import {
  GET_LIST_ALL_CLUB,
  GET_LIST_EVENT_DONATE_DETAIL,
  NEW_DONATE_REQUEST
} from '../../constants/config';
import { destructServerErrors } from '../../helpers/error';
import { getTakenData, postData } from '../../services/base_services';
import InputCurrency from '../../component/common/InputCurrency';
const AddDonate = (props) => {
  const idUser = useSelector(
    (state) => state && state.user && state.user.user && state.user.user.id
  );
  const { history } = props;
  const formatDate2 = 'dd-MM-yyyy';
  let formData = {};
  const IDEventRef = useRef('');
  const nameRef = useRef('');
  const IDClubRef = useRef('');
  const sdtRef = useRef('');
  const addressRef = useRef('');
  const moneyRef = useRef('');
  const bankRef = useRef('');
  const dateRef = useRef('');

  const [listEventDonate, setListEventDonate] = useState([]);
  const [contextData, setContextData] = useState([]);
  const [listClub, setListClub] = useState([]);
  const [errors, setErrors] = useState([]);

  const onSubmit = () => {
    const name = nameRef.current.value;
    const idEvent = IDEventRef.current.value;
    const phone = sdtRef.current.value;
    const idClub = IDClubRef.current.value;
    const address = addressRef.current.value;
    const money = moneyRef.current.value;
    const numberBank = bankRef.current.value;
    const date = dateRef.current.value.split('-').reverse().join('-');
    {
      formData = {
        event_id: idEvent,
        name: name,
        phone: phone,
        club_id: idClub,
        address: address,
        donated_money: money,
        bank_name: 'Name Bank',
        bank_account_number: numberBank,
        content: contextData,
        transfer_date: date,
        status: 0,
        created_by: idUser
      };

      postData(NEW_DONATE_REQUEST, formData)
        .then((res) => {
          createNotification('success', `Bạn đã thêm thành công`);
          setErrors('');
          history.push('/donate');
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

  const getListEvent = async () => {
    await getTakenData(GET_LIST_EVENT_DONATE_DETAIL)
      .then((res) => res && res.data)
      .then((data) => {
        setListEventDonate(data);
      });
  };
  const getListClub = async () => {
    await getTakenData(GET_LIST_ALL_CLUB).then((res) => {
      setListClub(res && res.data);
    });
  };
  const changeEditer = (e, editor) => {
    const data = editor.getData();
    setContextData(data);
  };
  useEffect(() => {
    getListEvent();
    getListClub();
  }, []);
  return (
    <>
      <section className="body-right-bottom">
        <div className="container-fluid content">
          <div className="row top-table">
            <div className="col-md-12 top-table-title">
              <p>Quản Lý Thông Tin Quyên Góp </p>
            </div>
            <div className="col-md-1 top-table-border "></div>
            <div className="col-md-12 top-table-text">Thêm Mới</div>
          </div>

          <div className="content-form">
            <div className="row">
              <div className="col-md-12 content-title">
                <p>Thêm Thông Tin Ủng Hộ</p>
              </div>
            </div>
            <div className="form-add">
              <div className="row">
                <div className="col-md-12">
                  <Select
                    label="Tên Chương Trình Ủng Hộ :(*)"
                    className="form-control input-form mb-3 input-blu"
                    name="event_id"
                    ref={IDEventRef}
                    errors={errors}
                    key_value="id"
                    key_label="title"
                    include_blank="Tên Chương Trình"
                    data={listEventDonate}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <InputText
                    label="Tên người ủng hộ : (*) "
                    className="form-control input-form"
                    placeholder=""
                    name="name"
                    ref={nameRef}
                    errors={errors}
                    type="text"
                  />
                </div>
                <div className="col-md-6">
                  <Select
                    label="Sinh Hoạt Ở Câu Lạc Bộ :"
                    className="form-control input-form form-control-product mb-3 input-grey"
                    name="club_id"
                    ref={IDClubRef}
                    errors={errors}
                    key_value="id"
                    key_label="name"
                    include_blank="Câu lạc bộ"
                    data={listClub}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <InputPhone
                    className="form-control input-form"
                    placeholder=""
                    name="phone"
                    ref={sdtRef}
                    label="Số điện thoại:"
                    errors={errors}
                    type="text"
                  />
                </div>
                <div className="col-md-6">
                  <InputText
                    label="Địa Chỉ :"
                    className="form-control input-form"
                    placeholder=""
                    name="address"
                    ref={addressRef}
                    errors={errors}
                    type="text"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <InputCurrency
                    className="form-control input-form"
                    placeholder=""
                    name="donated_money"
                    ref={moneyRef}
                    label="Số tiền ủng hộ: (VNĐ)(*)"
                    errors={errors}
                  />
                </div>
                <div className="col-md-6">
                  <InputPhone
                    className="form-control input-form"
                    placeholder=""
                    name="bank_account_number"
                    ref={bankRef}
                    label="Số Tài Khoản :(*) "
                    errors={errors}
                    type="text"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Datepicker
                    label="Thời Gian Chuyển Khoản (*): "
                    className="form-control input-form col-md-7"
                    name="transfer_date"
                    ref={dateRef}
                    errors={errors}
                    clearIcon={false}
                    format={formatDate2}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 custom-donate">
                  <TextEditor
                    name="content_notify"
                    label="Nội dung : "
                    errors={errors}
                    onChange={changeEditer}
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-12">
                  <div className="form-add-buttons">
                    <ButtonSave
                      onClick={() => onSubmit()}
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
};

export default withRouter(AddDonate);

AddDonate.propTypes = {
  history: PropTypes.isRequired
};
