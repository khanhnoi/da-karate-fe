/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import Table from '../../component/common/Table';
import ReactTooltip from 'react-tooltip';
import { confirmDelete, afterRemove } from '../../helpers/table';
import PropTypes from 'prop-types';
import editIcon from '../../assets/images/icon/edit-kn.svg';
import deleteIcon from '../../assets/images/icon/delete-kn.svg';
import detail from '../../assets/images/images/detail.svg'

import Paginate from '../../component/Paginate';
import { fetchBranchsMember } from '../../actions/branch';
import { withRouter } from 'react-router';
import { deleteById } from '../../services/base_services';
import { PER_PAGE } from '../../constants/variable';

const MemberBranch = (props) => {
  const [tableData, setTableData] = useState([]);
  const [paginate, setPaginate] = useState({
    total: 0,
    per_page: 5,
    current_page: 1
  });
  const id = props.match.params.id;

  useEffect(() => {
    fetchBranchsMember(id, 1).then((res) => {
      setTableData(res.data);
      setPaginate({ ...res.paginate, perPage: PER_PAGE });
    });
  }, []);


  const onEditMember = (id) => {
    props.history.push(`/statistical/club/id/${id}`);
  };
  const onDeleteMember = (id) => {
    confirmDelete().then((res) => {
      if (res.isConfirmed) {
        deleteById('club', id).then(() => {
          afterRemove('Đã Xoá Thành Công', 'succuss');
          fetchBranchsMember(id, paginate.current_page).then((res) => {
            setTableData(res.data);
            setPaginate({ ...res.paginate, perPage: PER_PAGE });
          });
        });
      }
    });
  };

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
      label: 'Tên Câu lạc bộ',
      index: null,
      option: {
        className: 'text-left'
      },
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
      label: 'Trưởng Câu lạc bộ',
      index: null,
      option: {
        className: ''
      },
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
      label: 'Số võ sinh',
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
        className: 'text-center'
      },
      callback: (data) => {
        if (data && data.id) {
          return (
            <div className="btn-group">
              <span
                data-tip="Chi tiết câu lạc bộ"
                className="link-action ml-2 mr-2"
              ><div
                className="btn-icon"
                onClick={() =>
                  props.history.push(`/statistical/club/id/${data.id}`)
                }
                onKeyPress={() => { }}
                role="button"
                tabIndex="0"
              >
                  <img alt="edit" src={detail} className="btn-icon" />
                </div>
              </span>
              <span
                data-tip="Chỉnh sửa câu lạc bộ"
                className="link-action ml-2 mr-2"
              >
                <div
                  className="btn-icon"
                  onClick={() => onEditMember(data && data.id)}
                  onKeyPress={() => { }}
                  role="button"
                  tabIndex="0"
                >
                  <img src={editIcon} alt="" className="btn-icon" />
                </div>
              </span>
              <span
                data-tip="Xóa câu lạc"
                className="link-action ml-2 mr-2"
              >
                <div
                  className="btn-icon"
                  onClick={() => onDeleteMember(data && data.id)}
                  onKeyPress={() => { }}
                  role="button"
                  tabIndex="0"
                >
                  <img src={deleteIcon} alt="" className="btn-icon" />
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

  const changePage = (pageNumber) => {
    if (pageNumber !== paginate.current_page) {
      fetchBranchsMember(id, pageNumber, PER_PAGE).then((res) => {
        setTableData(res.data);
        setPaginate({ ...res.paginate, perPage: PER_PAGE });
      });
    }
  };


  return (
    <>
      <div className="container-fluid mt-3">
        <div className="statistic-content d-flex flex-column">
          <div className="row">
            <div className="col-md-12 p-0">
              <Table tableData={tableData} tableHeaders={tableHeaders} tablePaginate={paginate} />
            </div>
          </div>
          <div className="table-pagenatie ml-auto">
            <div className="paginate-wrapper">
              <Paginate paginate={paginate} changePage={changePage} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

MemberBranch.propTypes = {
  match: PropTypes.isRequired,
  history: PropTypes.isRequired,
};


export default withRouter(MemberBranch);
