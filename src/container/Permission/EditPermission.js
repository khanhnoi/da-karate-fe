import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import InputText from '../../component/common/InputText';
import {
  getTakenData,
  getDataByID,
  putData
} from '../../services/base_services';
import ButtonSave from '../../component/common/ButtonSave';
import { destructServerErrors } from '../../helpers/error';
import { showMessage } from '../../helpers/table';
import Select from '../../component/common/Select';
import {
  DETAIL_ROLE_REQUEST,
  EDIT_ROLE_REQUEST,
  GET_LIST_ALL_ROLES_EXAMPLE
} from '../../constants/config';
import CheckboxCustom from '../../component/common/CheckboxCustom';
import { getFormDataFromRef } from '../../helpers/form';

class EditPermission extends Component {
  constructor(props) {
    super(props);
    this.permission = [];
    this.state = {
      status: false,
      errors: [],
      rolesExample: [],
      data: {},
      showPermissionExample: true
    };
  }

  onUpdate = (e) => {
    let { id } = this.props.match.params;
    e.preventDefault();
    let formData = getFormDataFromRef(this.refs);
    formData = {
      ...formData,
      permission_ids: this.permission
    };
    if (id) {
      putData(EDIT_ROLE_REQUEST, id, formData)
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
    }
  };

  componentDidMount = async () => {
    this.getListRolesExample();
    let { id } = this.props.match.params;
    if (id) {
      await getDataByID(DETAIL_ROLE_REQUEST, id)
        .then((res) => {
          res.data.group_permissions.map((item) => {
            item.permissions.map((item2) => {
              if (item2.checked) {
                return this.permission.push(item2.id);
              }
            });
          });

          this.setState({
            showPermissionExample: res.data.allow_del,
            data: res.data
          });
          return Promise.resolve({ res });
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
  };

  getListRolesExample = async () => {
    await getTakenData(GET_LIST_ALL_ROLES_EXAMPLE).then((res) => {
      this.setState({
        rolesExample: res.data
      });
    });
  };

  checkAll = (e) => {
    const target = e.target;
    const checkboxes = document.getElementsByName('permission[]');
    if (target.checked) {
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
        this.permission.push(parseInt(checkboxes[i].value));
      }
    } else {
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
      this.permission = [];
    }
  };

  handleInputChange = (e) => {
    const target = e.target;
    let value = parseInt(target.value);
    if (target.checked) {
      this.permission.push(value);
    } else {
      this.permission.splice(this.permission.indexOf(value), 1);
    }
  };

  onChangeRoleExample = async (e) => {
    this.permission = [];
    this.setState({
      data: {}
    });
    let target = e.target;
    let id = target.value;
    if (id) {
      await getDataByID(DETAIL_ROLE_REQUEST, id)
        .then((res) => {
          res.data.group_permissions.map((item) => {
            item.permissions.map((item2) => {
              if (item2.checked) {
                return this.permission.push(item2.id);
              }
            });
          });

          this.setState({
            data: res.data
          });
          return Promise.resolve({ res });
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
  };

  errorPermission = (error) => {
    return (
      error &&
      error.permission_ids && (
        <div className="form-group has-errors">
          <div className="invalid-feedback">{error.permission_ids[0]}</div>
        </div>
      )
    );
  };

  render() {
    let { status, errors, rolesExample, showPermissionExample } = this.state;
    let { name, group_permissions } = this.state.data;
    if (status) {
      return (
        <Redirect
          to={{
            pathname: '/setting/permission'
          }}
        />
      );
    }
    return (
      <>
        <div className="body-right-bottom">
          <div className="container-fluid container-shadow">
            <div className="row top-table">
              <div className="col-md-12 top-table-title">
                <p>Quản lý phân quyền</p>
              </div>
              <div className="col-md-1 top-table-border "></div>
              <div className="col-md-12 top-table-text">Chỉnh sửa quyền</div>
            </div>
            <div className="row">
              <div className="col-md-12 form-title">
                <p>Chỉnh sửa quyền</p>
              </div>
              <div className="col-md-6">
                <InputText
                  className="form-control input-form form-small form-input-permission"
                  placeholder="Tên nhóm phân quyền"
                  name="name"
                  ref="name"
                  label="Tên nhóm phân quyền:"
                  errors={errors}
                  defaultValue={name}
                />
              </div>
              {showPermissionExample ? (
                <div className="col-md-6">
                  <Select
                    className="form-control input-form form-small form-input-permission"
                    name="permisson_temp"
                    ref="permisson_temp"
                    label="Phân quyền mẫu:"
                    include_blank="Phân quyền mẫu"
                    key_value="id"
                    key_label="name"
                    data={rolesExample}
                    errors={errors}
                    onChange={this.onChangeRoleExample}
                  />
                </div>
              ) : (
                ''
              )}
              <div className="col-md-12 mt-3">
                <h5 className="title-checkbox">Chi tiết phân quyền:</h5>
                {this.errorPermission(errors)}
                <CheckboxCustom
                  errors={[]}
                  label="Tất cả"
                  name="name[]"
                  id="all"
                  multiple={true}
                  defaultChecked={false}
                  onChange={this.checkAll}
                />
              </div>
            </div>
            <div className="row">
              {group_permissions &&
                group_permissions.map((item) => {
                  return (
                    <div className="col-md-3 mt-1 mb-1">
                      <h5 className="title-checkbox">{item.name}:</h5>
                      {item &&
                        item.permissions &&
                        item.permissions.map((item2) => {
                          return (
                            <CheckboxCustom
                              errors={[]}
                              id={`permission_id_${item2.id}`}
                              refs={`permission_id_${item2.id}`}
                              label={item2.name}
                              value={item2.id}
                              onChange={this.handleInputChange}
                              name="permission[]"
                              defaultChecked={item2.checked}
                              errors={errors}
                            />
                          );
                        })}
                    </div>
                  );
                })}
            </div>
            <div className="row justify-content-center">
              <div className="col-md-6 d-flex offset-md-3 my-5">
                <ButtonSave
                  onClick={this.onUpdate}
                  text="Lưu thông tin"
                  className="button-new ml-0"
                />
                <Link to="/setting/permission">
                  <ButtonSave text="Hủy" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(EditPermission);
