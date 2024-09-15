import { Pagination } from 'antd';
import './pagination.css';
import PropTypes from 'prop-types';

export default function PaginatedComponent({ totalPages, changePage, currentPage }) {
  return (
    <div className="custom-pagination">
      <Pagination
        current={currentPage}
        total={totalPages}
        pageSize={1}
        showSizeChanger={false}
        align="center"
        hideOnSinglePage={true}
        onChange={(page) => changePage(page)}
        itemRender={(page, type, originalElement) => {
          // Скрываем последнюю страницу
          if (page === totalPages) {
            return null; // Не отображать последнюю страницу
          }
          if (type === 'jump-prev') {
            return null; // Скрываем кнопку jump-prev
          }
          if (type === 'jump-next') {
            return null; // Скрываем кнопку jump-prev
          }
          return originalElement;
        }}
      />
    </div>
  );
}

PaginatedComponent.propTypes = {
  totalPages: PropTypes.number.isRequired,
  changePage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};
