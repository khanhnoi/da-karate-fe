import React, { Component } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import PropTypes from 'prop-types';
import { stt } from '../../helpers/table';
import Loading from './LoadingTableStudent';

class Table extends Component {
  initTableRow = (data, index) => {
    const { tablePaginate, roleMember, tableHeaders } = this.props;
    const idx = index;

    return (
      <tr>
        {tableHeaders.map((header) => {
          let value = data;
          if (header.index) {
            value = data[header.index];
          }

          if (header.callback) {
            value = header.callback(value, roleMember);
          }

          if (tablePaginate && header.index && header.index === 'stt') {
            value = stt(idx, tablePaginate.current_page, tablePaginate.perPage);
          }
          if (header.show === false) {
            return;
          }
          return (
            <td {...header.option}>
              {value}
            </td>
          );
        })}
      </tr>
    );
  };

  render() {
    const { tableHeaders, tableData, isLoading, fixed } = this.props;
    return (
      <ScrollContainer
        className={`scrollable  ${fixed && 'table-fixed'}`}
        vertical={false}
        hideScrollbars={false}
      >
        <table className="table  table-custom-2 auto">
          <thead className="table-thead">
            <tr>
              {tableHeaders.map((header) => {
                if (header.show === false) {
                  return;
                }
                return (
                  <th
                    className={`text-center table-header ${
                      header.className || ''
                    }`}
                  >
                    {header.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="table-tbody">
            {isLoading && (
              <tr>
                <td className="no-result" colSpan={tableHeaders.length}>
                  <Loading count="10" />
                </td>
              </tr>
            )}

            {tableData.length === 0 && !isLoading && (
              <tr>
                <td className="no-result" colSpan={tableHeaders.length}>
                  Không có bản ghi nào
                </td>
              </tr>
            )}

            {tableData.length > 0 &&
              !isLoading &&
              tableData.map(this.initTableRow)}
          </tbody>
        </table>
      </ScrollContainer>
    );
  }
}

export default Table;

Table.propTypes = {
  tablePaginate: PropTypes.func.isRequired,
  roleMember: PropTypes.func.isRequired,
  tableHeaders: PropTypes.func.isRequired,
  tableData: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  fixed: PropTypes.bool.isRequired
};
