import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import upload from '../../assets/images/upload-kn.png';
import pen from '../../assets/images/icon/edit-kn.svg';
import upload2 from '../../assets/images/icon/upload-kn.svg';
import image from '../../assets/images/image.svg';
import MemberBranch from './MemberBranch';
import {
  getBranchDetail,
  editBranch,
  fetchBranchs
} from '../../actions/branch';
import GroupFile from '../../component/common/GroupFile';
import { BASE_IMG } from '../../constants/config';

const DetailBranch = (props) => {
  const [branchDetail, setBranchDetail] = useState(null);
  const [bgrImage, setBgrImage] = useState([]);
  const [active, setActive] = useState('club');
  const id = props.match.params.id;

  useEffect(() => {
    getBranchDetail(id).then((data) => {
      setBranchDetail(data);
      setBgrImage(data.bgr_image);
    });
  }, []);

  useEffect(() => {
    if (branchDetail && branchDetail.bgr_image !== bgrImage) {
      const data = {
        name: branchDetail.name,
        bgr_image: bgrImage
      };
      editBranch(data, id).then(() => {
        getBranchDetail(id).then((data) => {
          setBranchDetail(data);
          setBgrImage(data.bgr_image);
        });
      });
    }
  }, [bgrImage]);

  const addClass = (elements, myClass) => {
    let element = elements;
    if (typeof elements === 'string') {
      element = document.querySelectorAll(elements);
    } else if (!elements.length) {
      element = [elements];
    }
    for (let i = 0; i < element.length; i += 1) {
      if (!` ${element[i].className} `.indexOf(` ${myClass} `) > -1) {
        element[i].className += ` ${myClass}`;
      }
    }
  };

  const removeClass = (elements, myClass) => {
    let element = elements;
    if (typeof elements === 'string') {
      element = document.querySelectorAll(elements);
    } else if (!elements.length) {
      element = [elements];
    }
    const reg = new RegExp(`(^| )${myClass}($| )`, 'g');
    for (let i = 0; i < element.length; i += 1) {
      element[i].className = element[i].className.replace(reg, ' ');
    }
  };

  const handleMember = () => {
    if (active === 'club') {
      addClass(document.querySelector('#memberClbId'), 'buttons-btn--active');
      removeClass(document.querySelector('#ClbId'), 'buttons-btn--active');
      document.querySelector('#infoMemberId').style.display = 'block';
      document.querySelector('#infoClbId').style.display = 'none';
      setActive('member');
    }
  };

  const handleClb = () => {
    if (active === 'member') {
      addClass(document.querySelector('#ClbId'), 'buttons-btn--active');
      removeClass(
        document.querySelector('#memberClbId'),
        'buttons-btn--active'
      );
      document.querySelector('#infoMemberId').style.display = 'none';
      document.querySelector('#infoClbId').style.display = 'flex';
      setActive('club');
    }
  };

  const onChangeDocument = (data) => {
    setBgrImage(data);
  };

  return (
    <>
      <section className="body-right-bottom">
        <div className="container-fluid content">
          <div className="row top-table">
            <div className="col-md-12 top-table-title">
              <p>Quản Lý Phân Đường </p>
            </div>
            <div className="col-md-1 top-table-border "></div>
            <div className="col-md-12 top-table-text">Chi Tiết Phân Đường</div>
          </div>

          <div className="content-form">
            <div className="row">
              <div className="col-md-12 content-title">
                <p>{branchDetail && branchDetail.name}</p>
              </div>
            </div>
          </div>

          <div className="buttons">
            <div
              className="buttons-btn buttons-btn--left buttons-btn--active"
              id="ClbId"
              onClick={() => handleClb()}
            >
              <p>Thông tin chung của phân đường</p>
            </div>
            <div
              className="buttons-btn buttons-btn--right"
              id="memberClbId"
              onClick={() => handleMember()}
            >
              <p>Thành viên phân đường</p>
            </div>
          </div>
          <div
            className="information"
            id="infoClbId"
          >
            <div className="content-form content-form--container">
              <div className="row">
                <div className="col-md-6">
                  <div className="information-upload">
                    <div className="information-upload-img">
                      {branchDetail && branchDetail.bgr_image ? (
                        <div className="information-upload-img-bg" style={{backgroundImage: `url(${BASE_IMG}${branchDetail.bgr_image})`}}>
                        </div>
                      ) : (
                          <Link to={`/statistical/branch/edit/${id}`}>
                            <img src={upload} alt="" />
                          </Link>
                        )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="information-info">
                    <div className="information-info-title">
                      <p>Thông tin trưởng phân đường :</p>
                    </div>
                    <div className="information-info-text">
                      <p>
                        <b>Huấn luyện viên: </b>
                        {branchDetail && branchDetail.branch_leader}
                      </p>
                      <p>
                        <b>Địa chỉ: </b>
                        {branchDetail && branchDetail.leader_address}
                      </p>
                      <p>
                        <b>Số điện thoại: </b>
                        {branchDetail && branchDetail.leader_phone}
                      </p>
                      <p>
                        <b>Email: </b>
                        {branchDetail && branchDetail.leader_email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="information-info-2">
                <div className="information-info-2-title">
                  <p>Thông tin khái quát về phân đường : </p>
                  <img
                    src={pen}
                    alt=""
                    onClick={() =>
                      props.history.push(
                        `/statistical/branch/edit/${branchDetail.id}`
                      )
                    }
                  />
                </div>
                <div className="information-info-2-text">
                  <p>{branchDetail && branchDetail.intro_branch}</p>
                </div>
              </div>

            </div>

          </div>

          <div
            className="information-member"
            id="infoMemberId"
          >
            <MemberBranch branchId={id} />
          </div>
        </div>
      </section>
    </>
  );
};

export default withRouter(DetailBranch);

DetailBranch.propTypes = {
  match: PropTypes.isRequired,
  history: PropTypes.isRequired
};
