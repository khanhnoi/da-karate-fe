import React, { useState } from 'react';
import Table from '../../component/common/Table';
import ButtonSave from '../../component/common/ButtonSave';

const Examiner = () => {
  const [tableData, setTableData] = useState([]);
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
      label: 'HỌ TÊN',
      index: null,
      option: {
        className: 'text-center'
      }
    },
    {
      label: 'CHỨC DANH',
      index: null,
      option: {
        className: 'text-center'
      }
    },

    {
      label: 'ĐAI ĐẲNG',
      index: null,
      option: {
        className: 'text-center'
      }
    },

    {
      label: 'CÂU LẠC BỘ',
      index: null,
      option: {
        className: 'text-center'
      }
    },
    {
      label: 'CHỨC NĂNG',
      index: null,
      option: {
        className: 'text-center'
      }
    }
  ];
  return (
    <>
      <div className="row justify-content-between mt-4 ">
        <div className="ml-4">
          <p className="statistic-title px-2">Danh Sách Hội Đồng</p>
        </div>
        <div className="ml-auto">
          <ButtonSave
            text="Thêm giám khảo"
            className="btn btn-new"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Table tableData={tableData} tableHeaders={tableHeaders} />
        </div>
      </div>
    </>
  );
};
export default Examiner;
