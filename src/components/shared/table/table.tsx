import React, { FC, useEffect, useState } from 'react';
import { DataGrid, GridPaginationModel , GridToolbar } from '@mui/x-data-grid';
import { Box, CircularProgress } from '@mui/material';
import { ImageModal } from './ImageModal';
import { useTableColumns } from './useTableColumns';
import { useTablePermissions } from './useTablePermission';
import { useImageModal } from './useImageModal';
import { NON_DELETEABLE_IDS, PAGE_SIZE_OPTIONS } from './constants';
import CustomPageSizeSelector from './customPageSizeSelector';
import StripedDataGrid from './StripDataGrid';
import CustomNoRowsOverlay from './CustomNoRow';






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
          density: 'compact',
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
