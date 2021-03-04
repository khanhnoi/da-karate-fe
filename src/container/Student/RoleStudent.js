import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import NavStudent from './NavStudent';

import Select from '../../component/common/Select';
import ButtonSave from '../../component/common/ButtonSave';

import {
  GET_LIST_BRANCH,
  UPDATE_ROLE_STUDENT_REQUEST,
  GET_LIST_ALL_CLUB,
  GET_LIST_ALL_ROLES_EXAMPLE,
  GET_STUDENT_INFO,
} from '../../constants/config';
import {
  getTakenData,
  getDataByID,
  putData
} from '../../services/base_services';
import {
  destructServerErrors,
  destructServerMessage
} from '../../helpers/error';
import { showMessage } from '../../helpers/table';
import Checkbox from '../../component/common/Checkbox';
class RoleStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      club: [],
      listBranch: [],
      listClub: [],
      listRole: [],
      errors: [],
      isCheck: false,
      displayCheck: false
    };
  }

  getUser = async (id) => {
    //getUSer
    await getDataByID(GET_STUDENT_INFO, id).then((res) => {
      console.log(res && res.data);
      this.setState({
        user: res && res.data,
        isCheck: res && res.data && res.data.leader_flg
      });
      const { user } = this.state
      //getListClub and getClubUser
      getTakenData(GET_LIST_ALL_CLUB).then((res) => {
        this.setState({
          listClub: res && res.data
        });
        const { listClub, user } = this.state;
        const clubFind = listClub.find((item) => item.id === user.club_id);
        this.setState({
          club: clubFind
        });
      })

      //getListBranch and getBranchUser
      getTakenData(GET_LIST_BRANCH).then((res) => {
        this.setState({
          listBranch: res && res.data
        });
        const { listBranch } = this.state
        const branchFind = listBranch.find((item) => item.id === user.branch_id);
        this.setState({
          branch: branchFind
        });
      })

      //getListRole and getRolehUser
      getTakenData(GET_LIST_ALL_ROLES_EXAMPLE).then((res) => {
        this.setState({
          listRole: res && res.data
        });
        const { listRole } = this.state;
        const roleFind = listRole.find((item) => item.id === user.position_id);
        this.setState({
          role: roleFind,
          idCheck: roleFind && roleFind.id
        });
      });

    });
  };

  saveRole = (id) => {
    const { user } = this.state;
    let formData = {
      position_id: this.IDRoleRef.value,
      leader_flg: this.state.isCheck || false
    };


    if (this.IDRoleRef.value < 2 || this.IDRoleRef.value > 3) {
      formData = {
        position_id: this.IDRoleRef.value,
        leader_flg: false
      };
    }


    putData(UPDATE_ROLE_STUDENT_REQUEST, user.id, formData)
      .then((res) => {
        showMessage(res.data.message, true);
        this.setState({
          errors: [],
          status: true
        });
      })
      .catch((err) => {
        const errs = destructServerMessage(err);
        const errss = destructServerErrors(err);
        showMessage("Vai trò này đang đuợc nguời khác nắm giữ", false);
        this.setState({
          errors: errss
        });
      });
  }

  onCheck = () => {
    this.setState({
      isCheck: !this.state.isCheck
    })
  };
  checkDisplay = () => {
    // console.log('xxxxx', this?.IDRoleRef?.value);
    this.setState({
      idCheck: this.IDRoleRef.value
    })
  }


  componentDidMount = async () => {
    const { match } = this.props;
    const { params } = match;
    const { id } = params;
    this.getUser(id);
  }
  render() {
    const { errors, listBranch, listClub, listRole, club, user, branch, role, idCheck, isCheck } = this.state;
    return (
      <>
        <div className="body-right-bottom">
          <div className="content">
            <NavStudent />
            <div className="container-fluid mt-5 pt-0">
              <div className="content-form">
                <div className="row">
                  <div className="col-md-12 content-title">
                    <p>Cập Nhật Thông Tin Phân Quyền</p>
                  </div>
                </div>
                <div className="row form-add">
                  <div className="col-md-12">
                    <div className="form-add-title">
                      <span> {"Võ sinh đang sinh hoạt tại: "}</span>
                      {club && club.name && (
                        <>
                          <span className="blue-txt">{club && club.name} </span>
                          <span className="blue-txt">{" - "} </span>
                        </>
                      )}

                      <span className="blue-txt"> {branch && branch.name}</span>
                    </div>

                  </div>
                  <div className="col-md-6">
                    <Select
                      label="Tên phân quyền được giao:"
                      className="form-control input-form form-control-product mb-3 input-grey"
                      name="role_id"
                      ref={(c) => {
                        this.IDRoleRef = c;
                      }}
                      errors={errors}
                      key_value="id"
                      key_label="name"
                      include_blank="Phân quyền"
                      data={listRole}
                      defaultValue={role}
                      onClick={this.checkDisplay}
                    />

                    {
                      idCheck == 2 || idCheck == 3 ? (
                        <div className="d-flex">
                          <Checkbox value={isCheck} id="check" onClick={() => this.onCheck()} />
                          <p>Chức vụ chính thức: Trưởng phân đường/ Câu lạc bộ</p>
                        </div>
                      ) : null
                    }



                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-12 my-5">
                    <div className="form-add-buttons">
                      <ButtonSave
                        onClick={this.saveRole}
                        text="Lưu thông tin"
                        className="btn btn-new ml-0"
                      />
                      <Link to="/statistical/student">
                        <ButtonSave text="Hủy" className="btn btn-cancel" />
                      </Link>
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

export default withRouter(RoleStudent);
