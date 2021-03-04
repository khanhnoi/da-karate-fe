/* eslint-disable react/display-name */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GET_LIST_CLUB, DELETE_COURSE, GET_LIST_COURSE } from '../../constants/config';
import { PER_PAGE } from '../../constants/variable';
import Table from '../../component/common/Table';
import ReactTooltip from 'react-tooltip';
import NewButton from '../../component/common/NewButton';
import InputSearch from '../../component/common/InputSearch';
import { confirmDelete } from '../../helpers/table';
import createNotification from '../../component/common/Notification';
import editIcon from '../../assets/images/icon/edit-kn.svg';
import deleteIcon from '../../assets/images/icon/delete-kn.svg';
import { postData, deleteById } from '../../services/base_services';
import Paginate from '../../component/Paginate';

const Course = () => {
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
      label: 'TIÊU ĐỀ',
      index: null,
      callback: (data) => {
        if (data && data.title !== null)
          return (
            <div>
              <span>{data && data.title}</span>
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
      label: 'THỜI GIAN HỌC',
      index: null,
      option: {
        className: 'text-center position-relative'
      },
      callback: (data) => {
        if (data && data.duration)
          return (
            <div>
              <span>{data && data.duration}</span>
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
      label: 'SỐ BÀI',
      index: null,
      option: {
        className: 'text-center position-relative'
      },
      callback: (data) => {
        if (data && data.num_lesson !== null)
          return (
            <div>
              <span>{data && data.num_lesson}</span>
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
      label: 'TÓM TẮT',
      index: null,
      option: {
        className: ''
      },
      callback: (data) => {
        if (data && data.course_overview !== "")
          return (
            <div>
              <span>{data && data.course_overview}</span>
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
                role="button"
                data-tip="Chỉnh Sửa Khoá Học"
                className="link-action mr-2"
                onClick={() => onEditCourse(data && data.id)}
                tabIndex="0"
                onKeyPress={() => { }}
              >
                <Link to={`/active/course/edit/${data && data.id}`}>
                  <img src={editIcon} className="btn-icon" alt="edit" />
                </Link>
              </span>
              <span
                role="button"
                data-tip="Xóa Khoá Học"
                className="link-action ml-2"
                onClick={() => onDeleteCourse(data && data.id, data && data.title)}
                tabIndex="0"
                onKeyPress={() => { }}
              >
                <img src={deleteIcon} className="btn-icon" alt="delete" />
              </span>
              <ReactTooltip
                className="tooltip-button"
                place="bottom"
                effect="float"
              />
            </div>
          );
        }
        return '';
      }
    }
  ];

  const getListCourse = (newReq) => {
    postData(GET_LIST_COURSE, newReq)
      .then((res) => res && res.data)
      .then((res) => {
        setPaginate({ ...res.paginate, perPage });
        setTableData(res && res.data);
      });
  };
  const deleteCourse = (id, name) => {
    deleteById(DELETE_COURSE, id).then(() => {
      setNumberDelete(numberDelete + 1);
      createNotification('success', `Bạn đã xoá thành công khoá học ${name}`);
    });
  };
  const onEditCourse = (id) => { };
  const onDeleteCourse = (id, name) => {
    confirmDelete().then((res) => {
      if (res && res.value) {
        deleteCourse(id, name);
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
    getListCourse(req);
  }, [req, numberDelete]);

  return (
    <>
      <section className="body-right-bottom">
        <div className="container-fluid content">
          <div className="row top-table">
            <div className="col-md-12 top-table-title">
              <p>Quản Lý Hoạt Động </p>
            </div>
            <div className="col-md-1 top-table-border "></div>
            <div className="col-md-12 top-table-text">
              Tất Cả Khoá Học
            </div>
          </div>

          <div className="row">
            <div className="ml-auto d-flex flex-wrap px-15px">
              <InputSearch
                onChange={onChangeSearch}
              />
            </div>
            <Link to="/active/course/new" className="my-auto pb-2">
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

export default Course;
