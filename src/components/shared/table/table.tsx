import React, { FC, useEffect, useState } from 'react';
import { DataGrid, GridPaginationModel , GridToolbar } from '@mui/x-data-grid';
import { Box, CircularProgress } from '@mui/material';
import { ImageModal } from './ImageModal';
import { useTableColumns } from './useTableColumns';
import { useTablePermissions } from './useTablePermission';
import { useImageModal } from './useImageModal';
import { NON_DELETEABLE_IDS, PAGE_SIZE_OPTIONS } from './constants';
import CustomPageSizeSelector from './customPageSizeSelector';
import { alpha, styled } from '@mui/material/styles';
import { gridClasses } from '@mui/x-data-grid';
const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {

    backgroundColor: theme.palette.grey[200],
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      cursor: 'pointer',
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
          theme.palette.action.selectedOpacity +
          theme.palette.action.hoverOpacity,
        ),

        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}));

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .no-rows-primary': {
    fill: '#3D4751',
    ...theme.applyStyles('light', {
      fill: '#AEB8C2',
    }),
  },
  '& .no-rows-secondary': {
    fill: '#1D2126',
    ...theme.applyStyles('light', {
      fill: '#E8EAED',
    }),
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={96}
        viewBox="0 0 452 257"
        aria-hidden
        focusable="false"
      >
        <path
          className="no-rows-primary"
          d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
        />
        <path
          className="no-rows-secondary"
          d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
        />
      </svg>
      <Box sx={{ mt: 2 }}>No rows</Box>
    </StyledGridOverlay>
  );
}


interface TableComponentProps {
  tableData: any[];
  tableColumns: string[];
  columnMappings: { [key: string]: string };
  showMenu?: boolean;
  totalSize: number;
  currentPage: number;
  balancePermission?: string;
  pageSize: number;
  paginator?: boolean;
  noDataMessage?: string;
  editPermission?: string;
  deletePermission?: string;
  onPageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  onRowSelected: (id: string) => void;
  onEditRow: (id: string) => void;
  onDeleteRow: (id: string) => void;
}

const TableComponent: FC<TableComponentProps> = ({
  tableData,
  tableColumns,
  columnMappings,
  showMenu = true,
  totalSize,
  currentPage,
  balancePermission = '',
  pageSize,
  noDataMessage = 'No data available',
  editPermission = '',
  deletePermission = '',
  onPageChange,
  handlePageSizeChange,
  onRowSelected,
  onEditRow,
  onDeleteRow,
}) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: currentPage - 1, // Convert to 0-based for DataGrid
    pageSize: pageSize,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPaginationModel((prevModel) => ({
      ...prevModel,
      page: currentPage - 1,
    }));
  }, [currentPage]);

  useEffect(() => {
    setPaginationModel((prevModel) => ({
      ...prevModel,
      pageSize: pageSize,
    }));
  }, [pageSize]);

  const { editAllowance, deleteAllowance, showBalanceColumns } = useTablePermissions({
    editPermission,
    deletePermission,
    balancePermission,
  });

  const {
    isModalOpen,
    imageToShow,
    handleImageClick,
    handleCloseModal,
  } = useImageModal();

  const columns = useTableColumns({
    tableColumns,
    columnMappings,
    showBalanceColumns,
    showMenu,
    editAllowance,
    deleteAllowance,
    nonDeleteAbleIds: NON_DELETEABLE_IDS,
    onImageClick: handleImageClick,
    onEditRow,
    onDeleteRow,
  });

  const handlePaginationModelChange = async (newModel: GridPaginationModel) => {
    setLoading(true); // Show loader
    const newPage = newModel.page + 1; // Convert from 0-based to 1-based indexing
    const newPageSize = newModel.pageSize;

    setPaginationModel(newModel);

    // Only trigger updates if values actually changed
    if (newPage !== currentPage) {
      await onPageChange(newPage);
    }

    if (newPageSize !== pageSize) {
      await handlePageSizeChange(newPageSize);
    }
    setLoading(false); // Hide loader after update
  };

  const handleCustomPageSizeChange = async (newPageSize: number) => {
    setLoading(true); // Show loader
    const newModel = { ...paginationModel, pageSize: newPageSize, page: 1 };
    await handlePaginationModelChange(newModel);
    setLoading(false); // Hide loader after update
  };

  return (
    <Box sx={{ width: '100%', height: 400, position: 'relative' }}>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2  }}>
        <CustomPageSizeSelector
          pageSize={paginationModel.pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageSizeChange={handleCustomPageSizeChange}
        />
      </Box>
      <StripedDataGrid
        rows={tableData}
        columns={columns}
        pagination
        paginationMode="server"
        rowCount={totalSize}
        checkboxSelection

        initialState={{
          pagination: {
            paginationModel,
          },
        }}
        pageSizeOptions={[5]}
        onPaginationModelChange={handlePaginationModelChange}
        onRowClick={(params) => onRowSelected(params.id.toString())}
        disableRowSelectionOnClick
        loading={loading}
        keepNonExistentRowsSelected
        autoHeight
        
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'even'
        }
        slotProps={{
          loadingOverlay: {
            variant: 'skeleton',
            noRowsVariant: 'skeleton',
          },
        }}
        slots={{ noRowsOverlay: CustomNoRowsOverlay ,toolbar: GridToolbar}}
        // localeText={{
        //   noRowsLabel: noDataMessage,
        // }}
      />

    
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={imageToShow}
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default TableComponent;
