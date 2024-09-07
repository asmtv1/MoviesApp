import { Pagination } from "antd";
import "./pagination.css";
import { useState, useEffect } from "react";

const PaginatedComponent = ({ totalPages, changePage, currentPage }) => {
  return (
    <div className="custom-pagination">
      <Pagination
        current={currentPage}
        defaultCurrent={1}
        total={totalPages}
        pageSize={1}
        showSizeChanger={false}
        onChange={(page) => changePage(page)}
      />
    </div>
  );
};

export default PaginatedComponent;
