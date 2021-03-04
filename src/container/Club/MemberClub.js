/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import {
  GET_LIST_MEMBER_CLUB,
  DELETE_MEMBER_CLB
} from '../../constants/config';
import { PER_PAGE } from '../../constants/variable';

import Table from '../../component/common/Table';
import Paginate from '../../component/Paginate';
import InputSearch from '../../component/common/InputSearch';
import { confirmDelete } from '../../helpers/table';
import createNotification from '../../component/common/Notification';

import editIcon from '../../assets/images/icon/edit-kn.svg';
import deleteIcon from '../../assets/images/icon/delete-kn.svg';

import { postDataByID, deleteById } from '../../services/base_services';
import Belt from '../../component/common/Belt';

const MemberClub = (props) => {
  const { match } = props;
  const perPage = PER_PAGE || 5;
  const idClb = match && match.params && match.params.id;
  const [tableData, setTableData] = useState([]);
  const [paginate, setPaginate] = useState([]);
  const [numberDelete, setNumberDelete] = useState(0);
  const [key, setKey] = useState('');
  const [req, setReq] = useState({
    keyword: key,
    page: 1,
    // eslint-disable-next-line camelcase
    per_page: perPage
  });

  const changePage = (pageNumber) => {
    setReq({
      keyword: key,
      page: pageNumber,
      // eslint-disable-next-line camelcase
      per_page: perPage
    });
  };
  const getListMemberClb = (newReq) => {
    postDataByID(GET_LIST_MEMBER_CLUB, idClb, newReq)
      .then((res) => res && res.data)
      .then((res) => {
        setPaginate({ ...res.paginate, perPage });
        setTableData(res && res.data);
      });
  };

  const onEditMember = (id) => { };
  const deleteMemberClb = (id, name) => {
    deleteById(DELETE_MEMBER_CLB, id).then(() => {
      setNumberDelete(numberDelete + 1);
      createNotification('success', `Bạn đã xoá thành công thành viên ${name}`);
    });
  };
  const onDeleteMember = (id, name) => {
    confirmDelete().then((res) => {
      if (res && res.value) {
        deleteMemberClb(id, name);
      }
    });
    return '';
  };
  const onChangeSearch = (e) => {
    const value = e.target.value ? e.target.value : '';
    setKey(value);
    setTimeout(() => {
      setReq({
        keyword: value,
        page: 1,
        // eslint-disable-next-line camelcase
        per_page: perPage
      });
    }, 500);
  };
  const formatDay = (join_date) => {
    const dateJoin = new Date(join_date);
    const date =
      dateJoin.getDate() > 9 ? dateJoin.getDate() : `0${dateJoin.getDate()}`;
    const month =
      dateJoin.getMonth() > 8
        ? dateJoin.getMonth() + 1
        : `0${dateJoin.getMonth() + 1}`;
    const year = dateJoin.getYear() + 1900;
    return `${date}-${month}-${year}`;
  };
  useEffect(() => {
    getListMemberClb(req);
  }, [req, numberDelete]);

  const tableHeaders = [
    {
      label: 'STT',
      index: 'stt',
      option: {
        className: 'text-center position-relative'
      },
      callback: null
    },
    {
      label: 'Họ Tên',
      index: null,
      callback: (data) => {
        if(data && data.name !== null)
        return (
          <div>
            <span>{data && data.name}</span>
          </div>
        );
        return (
          <div className="text-center">
            <span>{" - "}</span>
          </div>
        );
      }
    },
    {
      label: 'Ngày Nhập Môn',
      index: null,
      option: {
        className: 'text-center'
      },
      callback: (data) => {
        if(data && data.join_date !== null)
        return (
          <div>
            <span>{formatDay(data && data.join_date)}</span>
          </div>
        );
        return (
          <div className="text-center">
            <span>{" - "}</span>
          </div>
        );
      }
    },
    {
      label: 'Đai Đẳng',
      index: null,
      option: {
        className: 'text-center'
      },
      callback: (data) => {
        return (
          <div className="d-flex">
            <span className={`belt-user-${data && data.belt_id}`}></span>
            <span>{data && data.infoBelt && data.infoBelt.name}</span>
          </div>
        );
      }
    },
    {
      label: 'Trạng Thái',
      index: null,
      option: {
        className: 'text-center'
      },
      callback: (data) => {
        return (
          <div>
            {data && data.status ? (
              <span style={{ color: '#08a041' }}>Đang Hoạt Động</span>
            ) : (
                <span style={{ color: '#8898AA' }}>Không Hoạt Động</span>
              )}
          </div>
        );
      }
    },
    {
      label: 'CHỨC NĂNG',
      index: null,
      option: {
        className: 'text-center'
      },
      callback: (data) => {
        if (data && data.id) {
          return (
            <div className="btn-group">
              <span
                role="button"
                data-tip="Chỉnh sửa võ sinh"
                className="link-action mr-2"
                onClick={() => onEditMember(data && data.id)}
                tabIndex="0"
                onKeyPress={() => { }}
              >
                <Link to={`/statistical/student/edit/${data && data.id}`}>
                  <img src={editIcon} alt="" />
                </Link>
              </span>
              <span
                role="button"
                data-tip="Xóa Võ sinh"
                className="link-action ml-2"
                onClick={() =>
                  onDeleteMember(data && data.id, data && data.name)
                }
                tabIndex="0"
                onKeyPress={() => { }}
              >
                <img src={deleteIcon} className="btn-icon" alt="delete" />
              </span>
            </div>
          );
        }
        return '';
      }
    }
  ];

  return (
    <>
      <div className="row">
        <div className="col-md-12 d-flex">
          <div className="ml-auto d-flex">
            <InputSearch onChange={onChangeSearch} />
          </div>
        </div>
      </div>

      {/* </div> */}

      <div className="row">
        <div className="col-md-12">
          <Table
            tableData={tableData}
            tableHeaders={tableHeaders}
            tablePaginate={paginate}
          />
        </div>

        <div className="table-pagenatie ml-auto">
          <div className="paginate-wrapper">
            <Paginate
              paginate={paginate}
              changePage={changePage}
              per={perPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(MemberClub);

MemberClub.propTypes = {
  match: PropTypes.isRequired
};
