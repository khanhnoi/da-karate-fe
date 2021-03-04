/* eslint-disable react/display-name */
import React, {
  useState, useEffect, useRef
} from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { GET_LIST_CLUB, DELETE_CLB } from '../../constants/config';
import { PER_PAGE } from '../../constants/variable';

import Table from '../../component/common/Table';
import NewButton from '../../component/common/NewButton';
import InputSearch from '../../component/common/InputSearch';
import { confirmDelete } from '../../helpers/table';
import createNotification from '../../component/common/Notification';

import editIcon from '../../assets/images/icon/edit-kn.svg';
import deleteIcon from '../../assets/images/icon/delete-kn.svg';
import detail from '../../assets/images/images/detail.svg'

import { postData, deleteById } from '../../services/base_services';

import Paginate from '../../component/Paginate';

const Club = () => {
  const perPage = PER_PAGE || 5;
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
      label: 'Tên Câu Lạc Bộ',
      index: null,
      callback: (data) => {
        if (data && data.name !== null)
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
      label: 'Trưởng Câu lạc bộ',
      index: null,
      callback: (data) => {
        if (data && data.club_leader !== null)
          return (
            <div>
              <span>{data && data.club_leader}</span>
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
      label: 'Thuộc phân đường',
      index: null,
      callback: (data) => {
        if (data && data.branch && data.branch.name !== null)
          return (
            <div>
              <span>{data && data.branch && data.branch.name}</span>
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
      label: 'SỐ VÕ SINH',
      index: null,
      option: {
        className: 'text-center'
      },
      callback: (data) => {
        if (data && data.num_member !== null)
          return (
            <div>
              <span>{data && data.num_member}</span>
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
      label: 'CHỨC NĂNG',
      index: null,
      option: {
        className: 'text-center fixed-collumn'
      },
      callback: (data) => {
        if (data && data.id) {
          return (
            <div className="btn-group">
              <span
                data-tip="Chi Tiết Câu Lạc Bộ"
                className="link-action ml-2 mr-2"
              >
                <Link
                  className="d-block"
                  role="button"
                  tabIndex={0}
                  onClick={() => onEditClub(data && data.id)}
                  onKeyPress={() => { }}
                  to={`/statistical/club/id/${data && data.id}`}>
                  <img src={detail} alt="edit" />
                </Link>
              </span>

              <span
                data-tip="Chỉnh Sửa Câu Lạc Bộ"
                className="link-action ml-2 mr-2"
              >
                <Link
                  role="button"
                  className="d-block"
                  tabIndex={0}
                  onClick={() => onEditClub(data && data.id)}
                  onKeyPress={() => { }}
                  to={`/statistical/club/edit/${data && data.id}`}>
                  <img src={editIcon} alt="edit" />
                </Link>
              </span>


              <span
                data-tip="Xóa Câu Lạc Bộ"
                className="link-action ml-2"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onDeleteClub(data && data.id, data && data.name)}
                  onKeyPress={() => { }}
                >
                  <img alt="delete" src={deleteIcon} className="btn-icon" />
                </div>
              </span>
              <ReactTooltip
                className="tooltip-button"
                place="bottom"
                effect="float"
              />
            </div >
          );
        }
        return '';
      }
    }
  ];

  const getListClb = (newReq) => {
    postData(GET_LIST_CLUB, newReq)
      .then((res) => res && res.data)
      .then((res) => {
        setPaginate({ ...res.paginate, perPage });
        setTableData(res && res.data);
      });
  };
  const deleteClb = (id, name) => {
    deleteById(DELETE_CLB, id).then(() => {
      setNumberDelete(numberDelete + 1);
      createNotification('success', `Bạn đã xoá thành công Clb ${name}`);
    });
  };
  const onEditClub = (id) => { };
  const onDeleteClub = (id, name) => {
    confirmDelete().then((res) => {
      if (res && res.value) {
        deleteClb(id, name);
      }
    });
  };
  const changePage = (pageNumber) => {
    setReq({
      keyword: key,
      page: pageNumber,
      // eslint-disable-next-line camelcase
      per_page: perPage
    });
  };
  const typingTimeoutRef = useRef(null);
  const onChangeSearch = (e) => {
    const value = e.target.value ? e.target.value : '';
    setKey(value);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setReq({
        keyword: value,
        page: 1,
        // eslint-disable-next-line camelcase
        per_page: perPage
      });
    }, 500);
  };

  useEffect(() => {
    getListClb(req);
  }, [req, numberDelete]);

  return (
    <>
      <section className="body-right-bottom">
        <div className="container-fluid content">
          <div className="row top-table">
            <div className="col-md-12 top-table-title">
              <p>Quản Lý Câu Lạc Bộ </p>
            </div>
            <div className="col-md-1 top-table-border "></div>
            <div className="col-md-12 top-table-text">Tất Cả Câu Lạc Bộ</div>
          </div>

          <div className="row">
            <div className="ml-auto d-flex flex-wrap px-15px">
              <InputSearch
                onChange={onChangeSearch}
              />
            </div>
            <Link to="/statistical/club/addClub" className="my-auto pb-2">
              <NewButton />
            </Link>
          </div>

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
        </div>

      </section>
    </>
  );
};

export default Club;
