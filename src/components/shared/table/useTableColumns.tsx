import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { ImageCell, BooleanCell, NumberCell, DateCell, AccountNameCell } from './TableCellRenderers';

interface UseTableColumnsProps {
  tableColumns: string[];
  columnMappings: { [key: string]: string };
  showBalanceColumns: boolean;
  showMenu: boolean;
  editAllowance: boolean;
  deleteAllowance: boolean;
  nonDeleteAbleIds: string[];
  onImageClick: (src: string) => void;
  onEditRow: (id: string) => void;
  onDeleteRow: (id: string) => void;
}

export const useTableColumns = ({
  tableColumns,
  columnMappings,
  showBalanceColumns,
  showMenu,
  editAllowance,
  deleteAllowance,
  nonDeleteAbleIds,
  onImageClick,
  onEditRow,
  onDeleteRow,
}: UseTableColumnsProps): GridColDef[] => {
  const baseColumns = tableColumns
    .filter(column => showBalanceColumns || !['debit', 'credit', 'balance'].includes(column))
    .map((column): GridColDef => ({
      field: column,
      headerName: columnMappings[column] || column,
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        const value = params.value;

        if (column === 'image' && value) {
          return <ImageCell value={value} onImageClick={onImageClick} />;
        }

        if (column.toLowerCase().includes('date') && value) {
          return <DateCell value={value} />;
        }

        if (typeof value === 'boolean') {
          return <BooleanCell value={value} />;
        }

        if (typeof value === 'number') {
          return <NumberCell value={value} />;
        }

        if (column === 'accountName') {
          return <AccountNameCell {...params} />;
        }

        return value ?? '-';
      }
    }));

  if (showMenu && (editAllowance || deleteAllowance)) {
    baseColumns.push({
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 100,
      getActions: (params) => {
        const actions = [];

        if (editAllowance) {
          actions.push(
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              onClick={() => onEditRow(params.id.toString())}
              color="primary"
            />
          );
        }

        if (deleteAllowance && !nonDeleteAbleIds.includes(params.id.toString())) {
          actions.push(
            <GridActionsCellItem
              icon={<Delete />}
              label="Delete"
              onClick={() => onDeleteRow(params.id.toString())}
              color="error"
            />
          );
        }

        return actions;
      }
    });
  }

  return baseColumns;
};