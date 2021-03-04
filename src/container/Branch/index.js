/* eslint-disable react/display-name */
import React, { useState, useEffect, useRef } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Table from '../../component/common/Table';
import ReactTooltip from 'react-tooltip';
import InputSearch from '../../component/common/InputSearch';
import PropTypes from 'prop-types';
import { confirmDelete } from '../../helpers/table';
import editIcon from '../../assets/images/icon/edit-kn.svg';
import deleteIcon from '../../assets/images/icon/delete-kn.svg';
import filterIcon from '../../assets/images/icon/filter-kn.svg';
import searchIcon from '../../assets/images/icon/ic-search.svg';
import Paginate from '../../component/Paginate';
import { fetchBranchs, deleteBranch } from '../../actions/branch';
import _, { debounce } from 'lodash';
import detail from '../../assets/images/images/detail.svg'
import NewButton from '../../component/common/NewButton';
import { PER_PAGE } from '../../constants/variable';

const Branch = (props) => {
  const [tableData, setTableData] = useState([]);
  const [paginate, setPaginate] = useState([]);
  const [searchText, setSearchText] = useState('')
  useEffect(() => {
    fetchBranchs(1, PER_PAGE).then((res) => {
      setTableData(res.data);
      setPaginate({ ...res.paginate, perPage: PER_PAGE });
    });
  }, []);

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
      label: 'TÊN PHÂN ĐƯỜNG',
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
            <span> - </span>
          </div >
        );
      }
    },
    {
      label: 'Trưởng phân đường',
      index: null,
      callback: (data) => {
        if (data && data.branch_leader !== null)
          return (
            <div>
              <span>{data && data.branch_leader}</span>
            </div >
          );
        return (
          <div className="text-center">
            <span> - </span>
          </div >
        );
      }
    },
    {
      label: 'SỐ CLB',
      index: null,
      option: {
        className: 'text-center'
      },
      callback: (data) => {
        if (data && data.num_club !== null)
          return (
            <div>
              <span>{data && data.num_club}</span>
            </div>
          );
        return (
          <div className="text-center">
            <span> - </span>
          </div >
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
            <span> - </span>
          </div >
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
        if (data.id) {
          return (
            <div className="btn-group">
              <span
                data-tip="Chi Tiết Phân Đường"
                className="link-action ml-2 mr-2"
              >
                <Link
                  className="d-block"
                  role="button"
                  tabIndex={0}
                  onKeyPress={() => { }}
                  to={`/statistical/branch/detail/${data.id}`}>
                  <img src={detail} alt="edit" />
                </Link>
              </span>

              <span
                data-tip="Chỉnh Sửa Phân Đường"
                className="link-action ml-2 mr-2"
              >
                <Link
                  role="button"
                  className="d-block"
                  tabIndex={0}
                  onKeyPress={() => { }}
                  to={`/statistical/branch/edit/${data.id}`}>
                  <img src={editIcon} alt="edit" />
                </Link>
              </span>


              <span
                data-tip="Xóa Phân Đường"
                className="link-action ml-2"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => removeBranch(data.id)}
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
            </div>
          );
        }
        return '';
      }
    }
  ];

  const removeBranch = (id) => {
    confirmDelete().then((res) => {
      if (res.isConfirmed) {
        deleteBranch(id).then(() => {
          fetchBranchs(paginate.current_page).then((res) => {
            setTableData(res.data);
            setPaginate({ ...res.paginate, perPage: PER_PAGE });
          });
        });
      }
    });
  };

  const changePage = (pageNumber) => {
    if (pageNumber !== paginate.current_page) {
      fetchBranchs(pageNumber, PER_PAGE, searchText).then((res) => {
        setTableData(res.data);
        setPaginate({ ...res.paginate, perPage: PER_PAGE });
      });
    }
  };

  const debounceSearch = useRef(
    _.debounce((searchText) => {
      fetchBranchs(1, PER_PAGE, searchText).then((res) => {
        setTableData(res.data);
        setPaginate({ ...res.paginate, perPage: PER_PAGE });
      });
    }, 1000)
  );

  useEffect(
    () => {
      if (searchText) {
        debounceSearch.current(searchText);
      } else {
        setSearchText('');
        debounceSearch.current(searchText);

      }
    },
    [searchText]
  );

  return (
    <>
      <section className="body-right-bottom">
        <div className="container-fluid content">
          <div className="row top-table">
            <div className="col-md-12 top-table-title">
              <p>Quản Lý Phân Đường </p>
            </div>
            <div className="col-md-1 top-table-border "></div>
            <div className="col-md-12 top-table-text">Tất Cả Phân Đường</div>
          </div>
          <div className="statistic-content d-flex flex-column">
            <div className="row">
              <div className="ml-auto d-flex flex-wrap px-15px">
                <InputSearch
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <Link to="/statistical/branch/new" className="my-auto pb-2">
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
                  <Paginate paginate={paginate} changePage={changePage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

Branch.propTypes = {
  history: PropTypes.isRequired
};

export default withRouter(Branch);
