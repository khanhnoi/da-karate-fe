import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import ButtonSave from '../../component/common/ButtonSave';
import Datepicker from '../../component/common/Datepicker';
import GroupFile from '../../component/common/GroupOneFile';
import InputText from '../../component/common/InputText';
import Select from '../../component/common/Select';
import {
  DETAIL_CERTIFICATE_REQUEST,
  GET_ALL_BELT,
  UPDATE_CERTIFICATE_REQUEST
} from '../../constants/config';
import { destructServerErrors } from '../../helpers/error';
import { getFormDataFromRef } from '../../helpers/form';
import { showMessage } from '../../helpers/table';
import {
  getDataByID,
  getTakenData,
  putData
} from '../../services/base_services';

class AddCompetition extends Component {
  constructor(props) {
    super(props);
    this.certificate_image = '';
    this.state = {
      status: false,
      errors: [],
      listBelt: [],
      data: []
    };
  }

  onUpdate = (e) => {
    const { id } = this.props.match.params;
    const { idCertification } = this.props.match.params;
    e.preventDefault();
    let formData = getFormDataFromRef(this.refs);
    formData = {
      ...formData,
      user_id: id,
      certificate_image: this.certificate_image,
      license_date: this.license_date.value.split('-').reverse().join('-')
    };

    putData(UPDATE_CERTIFICATE_REQUEST, idCertification, formData)
      .then((res) => {
        showMessage(res.data.message, true);
        this.setState({
          errors: [],
          status: true
        });
      })
      .catch((err) => {
        const errs = destructServerErrors(err);
        this.setState({
          errors: errs
        });
      });
  };

  componentDidMount = async () => {
    // let { idCertification } = this.props.match.params;
    const { match } = this.props;
    const { params } = match;
    const { idCertification } = params;
    if (idCertification) {
      await getDataByID(DETAIL_CERTIFICATE_REQUEST, idCertification)
        .then((res) => {
          this.setState({
            data: res.data
          });
          return Promise.resolve({ res });
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
    this.getList();
  };

  getList = async () => {
    await getTakenData(GET_ALL_BELT).then((res) => {
      this.setState({
        listBelt: res.data
      });
    });
  };

  onChangeDocument = (data) => {
    this.certificate_image = data;
  };

  getDate = (str) => {
    if (str) {
      let arr = str.split('/');
      let st = arr[0];
      arr[0] = arr[1];
      arr[1] = st;
      return arr.join('/');
    }
  };

  render() {
    const { data, status, errors, listBelt } = this.state;
    const {
      infoBelt,
      identify_card_num,
      license_date,
      certificate_image
    } = data;
    const { history } = this.props;
    if (status) {
      return (
        <Redirect
          to={{
            pathname: `/statistical/student/certificate/${this.props.match.params.id}`
          }}
        />
      );
    }
    return (
      <>
        <div className="body-right-bottom">
          <div className="container-fluid content">
            <div className="row top-table">
              <div className="col-md-12 top-table-title">
                <p>Thống Kê</p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">Văn Bằng</div>
            </div>
            <div className="content-form">
              <div className="row">
                <div className="col-md-12 content-title">
                  <p>Sửa Văn Bằng</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Select
                    label="Cấp đai/Đẳng (*):"
                    className="form-control input-form mb-3 input-grey"
                    name="belt_id"
                    ref="belt_id"
                    errors={errors}
                    key_value="id"
                    key_label="name"
                    include_blank="Chọn đai"
                    data={listBelt}
                    defaultValue={infoBelt}
                  />
                  <InputText
                    className="form-control input-form"
                    placeholder="Mã định danh"
                    name="identify_card_num"
                    ref="identify_card_num"
                    label="Mã định danh: (Áp dung cho đai đen)"
                    errors={errors}
                    type="text"
                    defaultValue={identify_card_num}
                  />
                  <Datepicker
                    label="Ngày cấp bằng/Ngày thi (*):"
                    className="form-control input-form"
                    name="license_date"
                    ref={(c) => {
                      this.license_date = c;
                    }}
                    errors={errors}
                    clearIcon={false}
                    format="dd-MM-yyyy"
                    value={this.getDate(license_date)}
                  />
                </div>
                <div className="col-md-6">
                  {data && data.certificate_image ? (
                    <GroupFile
                      label="Chứng chỉ kèm theo"
                      name="certificate_image"
                      title="Chọn ảnh để tải"
                      errors={errors}
                      onChange={this.onChangeDocument}
                      default={[certificate_image]}
                    />
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="form-add-buttons">
                    <ButtonSave
                      onClick={this.onUpdate}
                      text="Lưu thông tin"
                      className="btn btn-new ml-0"
                    />
                    <div
                      onClick={history.goBack}
                      onKeyPress={[]}
                      role="button"
                      tabIndex={0}
                    >
                      <ButtonSave text="Hủy" className="btn btn-cancel" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

AddCompetition.propTypes = {
  history: PropTypes.func.isRequired,
  user: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, null)(withRouter(AddCompetition));
