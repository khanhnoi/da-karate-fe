import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, withRouter } from 'react-router-dom';

import logo from '../../assets/images/logo.svg';
import nav from '../../assets/images/icon/nav-kn.svg';
import info from '../../assets/images/icon/info-kn.svg';
import infoHover from '../../assets/images/icon/info-hover-kn.svg';
import operational from '../../assets/images/icon/operational-management-kn.svg';
import operationalHover from '../../assets/images/icon/process-hover-kn.svg';
import information from '../../assets/images/icon/information-management-kn.svg';
import informationHover from '../../assets/images/icon/information-management-hover-kn.svg';
import statistics from '../../assets/images/icon/statistics-kn.svg';
import statisticsHover from '../../assets/images/icon/statistics-hover-kn.svg';
import settings from '../../assets/images/icon/settings.svg';
import settingsHover from '../../assets/images/icon/settings-hover-kn.svg';
import data from '../../assets/images/icon/data-kn.svg';
import dataHover from '../../assets/images/icon/data-hover-kn.svg';
import donation from '../../assets/images/icon/donation.svg';
import donationHover from '../../assets/images/icon/donation-hover-kn.svg';
import user from '../../assets/images/icon/user-kn.svg';
import userHover from '../../assets/images/icon/user-hover-kn.svg';
import down from '../../assets/images/icon/down-kn.svg';

const getUrlCurrentMenu = (match) => {
  const url = match && match.url;
  const arrUrl = url.split('/');
  const menu = arrUrl[1];
  const urlObj = {
    [menu]: url
  };
  return urlObj;
};

const Menu = (props) => {
  const { match } = props;
  const urlCurrent = getUrlCurrentMenu(match);
  const urlDefault = {
    active: '/active/course',
    document: '/document/documents',
    libraries: '/libraries',
    statistical: '/statistical/branch',
    setting: '/setting/permission'
  };
  const [statusMenu, setStatusMenu] = useState(true);
  const [urlMenu, setUrlMenu] = useState({
    ...urlDefault,
    ...urlCurrent
  });

  const showMenu = () => {
    if (statusMenu) {
      document.querySelector('.menu').style.left = '-210px';
      document.querySelector('.body-right').style.paddingLeft = '40px';
      document.querySelector('.menu-when-hide').style.height = '336px';
      setTimeout(() => {
        document.querySelector('#list-menu').style.display = 'none';
      }, 200);
    } else {
      document.querySelector('.menu').style.left = '0';
      document.querySelector('.body-right').style.paddingLeft = '250px';
      document.querySelector('#list-menu').style.display = 'block';
      document.querySelector('.menu-when-hide').style.height = '0px';
    }
    setStatusMenu(!statusMenu);
  };
  const showMenuSub = (id) => {
    if (document.getElementById(id)) {
      const allChildren = document.querySelectorAll(`#${id} > *`);
      const total = allChildren.length;
      const heightDefault = 48;
      const heightTotal = `${heightDefault * total}px`;
      if (document.getElementById(id).style.height === heightTotal) {
        document.getElementById(id).style.height = '0';

        let idCur = id.split('');
        idCur.splice(id.length - 1, 1);
        idCur = idCur.join('');
        if (document.getElementById(idCur)) {
          document.querySelector(
            `#${idCur} > .item-menu-down`
          ).style.transform = 'scale(0)';
        }
      } else {
        document.getElementById(id).style.height = heightTotal;

        let idCur = id.split('');
        idCur.splice(id.length - 1, 1);
        idCur = idCur.join('');
        if (document.getElementById(idCur)) {
          document.querySelector(
            `#${idCur} > .item-menu-down`
          ).style.transform = 'scale(1)';
        }
      }
    }
  };

  const changeUrl = (menu, url) => {
    setUrlMenu({ ...urlMenu, [menu]: url });
  };

  useEffect(() => {
    setStatusMenu((props && props.menu) || true);
    if (!statusMenu) {
      document.querySelector('.menu').style.left = '-210px';
    } else {
      document.querySelector('.menu').style.left = '0';
    }
  }, []);
  return (
    <>
      <div className="menu menu--left" id="menu">
        <div className="menu-top top-menu d-flex">
          <Link to="/">
            <img src={logo} className="menu-top-logo" />
          </Link>
          <div className="menu-top-nav" onClick={() => showMenu()}>
            <img src={nav} />
          </div>
        </div>
        <ul id="list-menu">
          <li>
            <NavLink
              to="/home"
              activeClassName="active"
              className="nav-link-menu"
            >
              <div
                className="item-menu"
                onClick={() => showMenuSub('itemMenuId0')}
              >
                <img
                  className="item-menu-logo item-menu-logo--hover"
                  src={infoHover}
                  alt=""
                />
                <img className="item-menu-logo" src={info} alt="" />
                <p> Thông Tin Chung</p>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={urlMenu && urlMenu.active}
              activeClassName="active"
              className="nav-link-menu"
            >
              <div
                className="item-menu"
                id="itemMenuId1"
                onClick={() => showMenuSub('itemMenuId1s')}
              >
                <img
                  className="item-menu-logo item-menu-logo--hover"
                  src={operationalHover}
                  alt=""
                />
                <img className="item-menu-logo" src={operational} alt="" />
                <p>Quản lý Hoạt Động</p>
                <img className="item-menu-down" src={down} alt="" />
              </div>
              <ul
                className="list-sub"
                id="itemMenuId1s"
                style={{ height: '0' }}
              >
                <li>
                  <NavLink
                    to="/active/course"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() => changeUrl('active', '/active/course')}
                  >
                    <div className="item-menu-sub">
                      <p>Khóa học</p>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/active/competition"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() => changeUrl('active', '/active/competition')}
                  >
                    <div className="item-menu-sub">
                      <p>Kỳ Thi</p>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/active/event"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() => changeUrl('active', '/active/event')}
                  >
                    <div className="item-menu-sub">
                      <p>Sự kiện</p>
                    </div>
                  </NavLink>
                </li>
              </ul>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={urlMenu && urlMenu.document}
              activeClassName="active"
              className="nav-link-menu"
            >
              <div
                className="item-menu"
                id="itemMenuId2"
                onClick={() => showMenuSub('itemMenuId2s')}
              >
                <img
                  className="item-menu-logo item-menu-logo--hover"
                  src={informationHover}
                  alt=""
                />
                <img className="item-menu-logo" src={information} alt="" />
                <p>Quản Lý Thông Tin</p>
                <img className="item-menu-down" src={down} alt="" />
              </div>
              <ul
                className="list-sub"
                id="itemMenuId2s"
                style={{ height: '0' }}
              >
                <li>
                  <NavLink
                    to="/document/documents"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() => changeUrl('document', '/document/documents')}
                  >
                    <div className="item-menu-sub">
                      <p>Tất Cả bài viết</p>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/document/common"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() => changeUrl('document', '/document/common')}
                  >
                    <div className="item-menu-sub">
                      <p>Thông Báo Chung</p>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/document/private"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() => changeUrl('document', '/document/private')}
                  >
                    <div className="item-menu-sub">
                      <p>Thông Báo Riêng</p>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/document/share"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() => changeUrl('document', '/document/share')}
                  >
                    <div className="item-menu-sub">
                      <p>Chia Sẻ Của Thầy</p>
                    </div>
                  </NavLink>
                </li>
              </ul>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={urlMenu && urlMenu.libraries}
              activeClassName="active"
              className="nav-link-menu"
            >
              <div
                className="item-menu"
                id="itemMenuId3"
                onClick={() => showMenuSub('itemMenuId3s')}
              >
                <img
                  className="item-menu-logo item-menu-logo--hover"
                  src={dataHover}
                  alt=""
                />
                <img className="item-menu-logo" src={data} alt="" />
                <p>Tư Liệu</p>
                <img className="item-menu-down" src={down} alt="" />
              </div>
              <ul
                className="list-sub"
                id="itemMenuId3s"
                style={{ height: '0' }}
              >
                <li>
                  <NavLink
                    to="/libraries/video"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() => changeUrl('libraries', '/libraries/video')}
                  >
                    <div className="item-menu-sub">
                      <p>Video</p>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/libraries/ebook"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() => changeUrl('libraries', '/libraries/ebook')}
                  >
                    <div className="item-menu-sub">
                      <p>Ebook</p>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/libraries/photo"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() => changeUrl('libraries', '/libraries/photo')}
                  >
                    <div className="item-menu-sub">
                      <p>Photo</p>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/libraries/document"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() =>
                      changeUrl('libraries', '/libraries/document')
                    }
                  >
                    <div className="item-menu-sub">
                      <p>Document</p>
                    </div>
                  </NavLink>
                </li>
              </ul>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={urlMenu && urlMenu.statistical}
              activeClassName="active"
              className="nav-link-menu"
            >
              <div
                className="item-menu"
                id="itemMenuId4"
                onClick={() => showMenuSub('itemMenuId4s')}
              >
                <img
                  className="item-menu-logo item-menu-logo--hover"
                  src={statisticsHover}
                  alt=""
                />
                <img className="item-menu-logo" src={statistics} alt="" />
                <p>Thống Kê</p>
                <img className="item-menu-down" src={down} alt="" />
              </div>
              <ul
                className="list-sub"
                id="itemMenuId4s"
                style={{ height: '0' }}
              >
                <li>
                  <NavLink
                    to="/statistical/branch"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() =>
                      changeUrl('statistical', '/statistical/branch')
                    }
                  >
                    <div className="item-menu-sub">
                      <p>Phân Đường</p>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/statistical/club"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() =>
                      changeUrl('statistical', '/statistical/club')
                    }
                  >
                    <div className="item-menu-sub">
                      <p>Câu Lạc Bộ</p>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/statistical/student"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() =>
                      changeUrl('statistical', '/statistical/student')
                    }
                  >
                    <div className="item-menu-sub">
                      <p>Học Viên</p>
                    </div>
                  </NavLink>
                </li>
              </ul>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/donate"
              activeClassName="active"
              className="nav-link-menu"
            >
              <div
                className="item-menu"
                id="itemMenuId5"
                onClick={() => showMenuSub('itemMenuId5s')}
              >
                <img
                  className="item-menu-logo item-menu-logo--hover"
                  src={donationHover}
                  alt=""
                />
                <img className="item-menu-logo" src={donation} alt="" />
                <p>Quản Lý Donate</p>
                <img className="item-menu-down" src={down} alt="" />
              </div>
            </NavLink>
          </li>

          <li>
            <NavLink
              to={urlMenu && urlMenu.setting}
              activeClassName="active"
              className="nav-link-menu"
            >
              <div
                className="item-menu"
                id="itemMenuId6"
                onClick={() => showMenuSub('itemMenuId6s')}
              >
                <img
                  className="item-menu-logo item-menu-logo--hover"
                  src={settingsHover}
                  alt=""
                />
                <img className="item-menu-logo" src={settings} alt="" />
                <p>Cài Đặt</p>
                <img className="item-menu-down" src={down} alt="" />
              </div>
              <ul
                className="list-sub"
                id="itemMenuId6s"
                style={{ height: '0' }}
              >
                <li>
                  <NavLink
                    to="/setting/exam"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() => changeUrl('setting', '/setting/exam')}
                  >
                    <div className="item-menu-sub">
                      <p>Đề Thi</p>
                    </div>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/setting/permission"
                    activeClassName="active-sub"
                    className="nav-link-menu nav-link-menu-sub"
                    onClick={() => changeUrl('setting', '/setting/permission')}
                  >
                    <div className="item-menu-sub">
                      <p>Phân Quyền</p>
                    </div>
                  </NavLink>
                </li>
              </ul>
            </NavLink>
          </li>
        </ul>
        
        <div className="menu-when-hide">
          <NavLink
            to="/home"
            activeClassName="active-hide"
            className="nav-link-menu menu-when-hide-icon"
            onClick={() => changeUrl('home', '/home')}
          >
            <img className="item-menu-logo" src={info} alt="" />
            <img className="item-menu-logo item-menu-logo-hover" src={infoHover} alt="" />
          </NavLink>

          <NavLink
            to="/active/course"
            activeClassName="active-hide"
            className="nav-link-menu menu-when-hide-icon"
            onClick={() => changeUrl('active', '/active/course')}
          >
            <img className="item-menu-logo" src={operational} alt="" />
            <img className="item-menu-logo item-menu-logo-hover" src={operationalHover} alt="" />
          </NavLink>

          <NavLink
            to="/document/documents"
            activeClassName="active-hide"
            className="nav-link-menu menu-when-hide-icon"
            onClick={() => changeUrl('document/', '/document/documents')}
          >
            <img className="item-menu-logo" src={information} alt="" />
            <img className="item-menu-logo item-menu-logo-hover" src={informationHover} alt="" />
          </NavLink>

          <NavLink
            to="/libraries"
            activeClassName="active-hide"
            className="nav-link-menu menu-when-hide-icon"
            onClick={() => changeUrl('libraries', '/libraries')}
          >
            <img className="item-menu-logo" src={data} alt="" />
            <img className="item-menu-logo item-menu-logo-hover" src={dataHover} alt="" />
          </NavLink>

          <NavLink
            to="/statistical/branch"
            activeClassName="active-hide"
            className="nav-link-menu menu-when-hide-icon"
            onClick={() => changeUrl('statistical', '/statistical/branch')}
          >
            <img className="item-menu-logo" src={statistics} alt="" />
            <img className="item-menu-logo item-menu-logo-hover" src={statisticsHover} alt="" />
          </NavLink>

          <NavLink
            to="/donate"
            activeClassName="active-hide"
            className="nav-link-menu menu-when-hide-icon"
            onClick={() => changeUrl('donate', '/donate')}
          >
            <img className="item-menu-logo" src={donation} alt="" />
            <img className="item-menu-logo item-menu-logo-hover" src={donationHover} alt="" />
          </NavLink>

          <NavLink
            to="/setting/exam"
            activeClassName="active-hide"
            className="nav-link-menu menu-when-hide-icon"
            onClick={() => changeUrl('setting', '/setting/exam')}
          >
            <img className="item-menu-logo" src={settings} alt="" />
            <img className="item-menu-logo item-menu-logo-hover" src={settingsHover} alt="" />
          </NavLink>

        </div>
      </div>
    </>
  );
};

export default withRouter(Menu);

Menu.propTypes = {
  menu: PropTypes.isRequired,
  match: PropTypes.object.isRequired
};
