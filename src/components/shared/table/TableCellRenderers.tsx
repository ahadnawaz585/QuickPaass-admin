import React from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { formatDate } from '@/utils/date';

interface ImageCellProps {
  value: string;
  onImageClick: (src: string) => void;
}

export const ImageCell: React.FC<ImageCellProps> = ({ value, onImageClick }) => (
    <img
      src={value}
      alt="Image"
      onClick={(event: any) => {
        event.stopPropagation(); // Correct method name
        onImageClick(value);
      }}
      style={{
        width: '40px',
        height: '40px',
        objectFit: 'cover',
        borderRadius: '50%',
        cursor: 'pointer',
      }}
    />
  );
  

export const BooleanCell: React.FC<{ value: boolean }> = ({ value }) => (
  <span style={{ color: value ? 'green' : 'red' }}>
    {value ? '✔' : '✖'}
  </span>
);

export const NumberCell: React.FC<{ value: number }> = ({ value }) => (
  <>{new Intl.NumberFormat().format(value)}</>
);

export const DateCell: React.FC<{ value: string }> = ({ value }) => (
  <>{formatDate(value)}</>
);

export const AccountNameCell: React.FC<GridRenderCellParams> = (params) => (
  <span style={{ fontWeight: params.row.isLedgerAccount ? 'normal' : 'bold' }}>
    {params.value}
  </span>
);