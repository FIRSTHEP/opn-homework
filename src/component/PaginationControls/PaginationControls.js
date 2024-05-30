import React from 'react';
import { Pagination } from 'antd';
import './PaginationControls.css';

const PaginationControls = ({ currentPage, pageSize, totalCount, handlePaginationChange }) => {
  return (
    <div className="pagination-container">
      <Pagination
        showSizeChanger
        onChange={handlePaginationChange}
        current={currentPage}
        pageSize={pageSize}
        total={totalCount}
      />
    </div>
  );
};

export default PaginationControls;
