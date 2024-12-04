import { FC } from 'react';
import { Pagination, PaginationProps, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface PaginatorProps extends PaginationProps {
  pageIndex?: number;
  pageSize?: number;
  totalSize?: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const PaginatorComponent: FC<PaginatorProps> = ({
  pageIndex = 0,
  pageSize = 5,  // Set a default non-zero value
  totalSize = 0,
  onPageChange,
  onPageSizeChange,
}) => {
  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newSize = Number(event.target.value);
    onPageSizeChange(newSize);
  };

  // Calculate the range of items being displayed
  const startIndex = pageIndex * pageSize + 1;
  const endIndex = Math.min(startIndex + pageSize - 1, totalSize);
  const paginationSummary = `${startIndex} – ${endIndex} of ${totalSize}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
      <div style={{ flex: 1 }}>
        <Pagination
          page={pageIndex + 1}
          count={Math.ceil(totalSize / pageSize)}
          onChange={(event, page) => onPageChange(event, page - 1)}
          color="primary"
          showFirstButton
          showLastButton
          siblingCount={1}
        />
      </div>
      <div style={{ marginLeft: '20px', fontWeight: 'bold', color: '#2969c2' }}>
        {paginationSummary}
      </div>
      <div style={{ marginLeft: '20px', flexShrink: 0 }}>
        Rows per page: {'\u00A0'}
        <Select
          size="small"
          sx={{ height: '30px' }}
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          {[5, 10, 15, 20, 50].map(size => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default PaginatorComponent;
