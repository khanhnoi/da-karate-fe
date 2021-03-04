import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import upload from '../../assets/images/upload-kn.png';
import pen from '../../assets/images/icon/edit-kn.svg';
import upload2 from '../../assets/images/icon/upload-kn.svg';
import image from '../../assets/images/image.svg';
import MemberClub from './MemberClub';
import { getDataByID } from '../../services/base_services';
import { BASE_IMG } from '../../constants/config';

const ClubDetail = (props) => {
  const [clubDetail, setClubDetail] = useState(null);
  const { match } = props;
  const [active, setActive] = useState('club');
  const id = match && match.params && match.params.id;
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
      document.querySelector('#infoClbId').style.display = 'block';
      setActive('club');
    }
  };
  useEffect(() => {
    getDataByID('/club', id)
      .then((res) => res && res.data)
      .then((res) => {
        setClubDetail(res);
      });
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
            <div className="col-md-12 top-table-text">Chi Tiết Câu Lạc Bộ</div>
          </div>

          <div className="content-form">
            <div className="row">
              <div className="col-md-12 content-title">
                <p>{clubDetail && clubDetail.name}</p>
              </div>
            </div>
          </div>

          <div className="buttons">
            <div
              className="buttons-btn buttons-btn--left buttons-btn--active"
              id="ClbId"
              onClick={() => handleClb()}
            >
              <p>Thông Tin Chung Của Câu Lạc Bộ</p>
            </div>
            <div
              className="buttons-btn buttons-btn--right"
              id="memberClbId"
              onClick={() => handleMember()}
            >
              <p>Thành Viên Câu Lạc Bộ</p>
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
                      {clubDetail && clubDetail.bgr_image ? (
                        <div className="information-upload-img-bg" style={{backgroundImage: `url(${BASE_IMG}${clubDetail.bgr_image})`}}>
                        </div>
                      ) : (
                          <Link to={`/statistical/club/edit/${id}`}>
                            <img src={upload} alt="" />
                          </Link>
                        )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="information-info">
                    <div className="information-info-title">
                      <p>Thông tin trưởng câu lạc bộ :</p>
                    </div>
                    <div className="information-info-text">
                      <p>
                        <b>Huấn luyện viên: </b>
                        {clubDetail && clubDetail.club_leader}
                      </p>
                      <p>
                        <b>Địa chỉ: </b>
                        {clubDetail && clubDetail.leader_address}
                      </p>
                      <p>
                        <b>Số điện thoại: </b>
                        {clubDetail && clubDetail.leader_phone}
                      </p>
                      <p>
                        <b>Email: </b>
                        {clubDetail && clubDetail.leader_email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="information-info-2 ">
                <div className="information-info-2-title">
                  <p>Thông tin khái quát về câu lạc bộ : </p>
                  <Link to={`/statistical/club/edit/${id}`}>
                    <img src={pen} alt="" />
                  </Link>
                </div>
                <div className="information-info-2-text">
                  <p>{clubDetail && clubDetail.intro_club}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="information-member"
            id="infoMemberId"
          >
            <MemberClub idClb={id} />
          </div>
        </div>
      </section>
    </>
  );
};

export default withRouter(ClubDetail);

ClubDetail.propTypes = {
  match: PropTypes.isRequired
};
