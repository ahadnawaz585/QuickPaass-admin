import React, { FC, useState, lazy, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu, MenuItem, IconButton, Modal, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Clear';
import { permission } from '@/auth/access.service';
import { MoreVert, Edit, Delete } from '@mui/icons-material';
import styles from "./table.module.scss";
import { formatDate } from '@/utils/date';

const PaginatorComponent = lazy(() => import('../paginator/paginator'));
const DialogueComponent = lazy(() => import('../dialogue/dialogue'));

const TableComponent: FC<TableComponentProps> = ({
  tableData = [],
  tableColumns = [],
  columnMappings = {},
  showMenu = true,
  totalSize,
  currentPage,
  balancePermission = '',
  pageSize,
  paginator = true,
  noDataMessage = '',
  editPermission = '',
  deletePermission = '',
  onPageChange,
  handlePageSizeChange,
  onRowSelected,
  onEditRow,
  onDeleteRow,
}) => {
  const isBoolean = (value: any) => typeof value === 'boolean';
  const isNumber = (value: any) => typeof value === 'number';
  const [editAllowance, setEditAllowance] = useState<boolean>(false);
  const [deleteAllowance, setDeleteAllowance] = useState<boolean>(false);
  const [showBalanceColumns, setShowBalanceColumns] = useState<boolean>(false);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [deleteRowIndex, setDeleteRowIndex] = useState<number | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: number]: HTMLElement | null }>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const rightAlignedColumns = ['balance', 'debit', 'credit']; // Define right-aligned columns
  const [imageToShow, setImageToShow] = useState<string | null>(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const nonDeleteAbleIds = [
    "58c55d6a-910c-46f8-a422-4604bea6cd15",
    "a9f53d14-7177-45ef-bf74-f4b8d1a6ce0e",
    "2d9c89e7-466d-4b1c-b1b3-3ef5be815ed4"
  ]

  const checkPermissions = async () => {
    setEditAllowance(await permission(editPermission));
    setShowBalanceColumns(await permission(balancePermission));
    setDeleteAllowance(await permission(deletePermission));
  };

  const handleCellClick = (element: any) => {
    onRowSelected(element.id);
  };

  const handleImageClick = (src: string) => {
    setImageToShow(src);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setImageToShow(null);
    setIsModalOpen(false);
  };

  const handleEditClick = (rowIndex: number, event: React.MouseEvent<HTMLLIElement>) => {
    event.stopPropagation();
    setEditRowIndex(rowIndex);
    closeMenu(rowIndex);
  };

  const handleDeleteClick = (rowIndex: number, event: React.MouseEvent<HTMLLIElement>) => {
    event.stopPropagation();
    setDeleteRowIndex(rowIndex);
    closeMenu(rowIndex);
  };

  const handleConfirmEdit = (confirm: boolean) => {
    if (confirm && editRowIndex !== null) {
      onEditRow(tableData[editRowIndex].id);
    }
    setEditRowIndex(null);
  };

  const handleConfirmDelete = (confirm: boolean) => {
    if (confirm && deleteRowIndex !== null) {
      onDeleteRow(tableData[deleteRowIndex].id);
    }
    setDeleteRowIndex(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, rowIndex: number) => {
    event.stopPropagation();
    setMenuAnchorEl({ ...menuAnchorEl, [rowIndex]: event.currentTarget });
  };

  const closeMenu = (rowIndex: number) => {
    setMenuAnchorEl({ ...menuAnchorEl, [rowIndex]: null });
  };

  return (
    <div id="table">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              {tableColumns.map((column, index) => (
                // Conditionally render balance-related columns based on permission
                (showBalanceColumns || !['debit', 'credit', 'balance'].includes(column)) && (
                  <TableCell key={index} style={{ fontWeight: 'bold', color: '#2969c2', fontSize: '16px', textAlign: rightAlignedColumns.includes(column) ? 'right' : 'left' }}>
                    {columnMappings[column] || column}
                  </TableCell>
                )
              ))}
              {showMenu && <TableCell style={{ paddingTop: 0, paddingBottom: 0 }}></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => handleCellClick(row)}
                onMouseEnter={() => setHoveredRowIndex(rowIndex)}
                onMouseLeave={() => setHoveredRowIndex(null)}
                style={{ backgroundColor: hoveredRowIndex === rowIndex ? '#f5f5f5' : 'inherit', cursor: 'pointer' }}
              >
                {tableColumns.map((column, colIndex) => (
                  // Conditionally render balance-related cells based on permission
                  (showBalanceColumns || !['debit', 'credit', 'balance'].includes(column)) && (
                    <TableCell
                      key={colIndex}
                      style={{
                        color: column === 'balance' && row[column].startsWith("-") ? 'red' : 'inherit',
                        textAlign: rightAlignedColumns.includes(column) ? 'right' : 'left' // Apply right alignment if the column is in the array
                      }}
                    >
                      {column === 'image' && row[column] ? (
                        <img
                          src={`${row[column]}`}
                          alt="Image"
                          onClick={(event) => {
                            event.stopPropagation(); // Prevents the parent cell's click handler
                            handleImageClick(row[column]); // Call your image click handler
                          }}
                          style={{
                            width: '30px',
                            height: '30px',
                            objectFit: 'cover',
                            borderRadius: '50%' // Makes the image circular
                          }}
                        />
                      ) : column.toLowerCase().includes('date') && row[column] ? ( // Check for date columns
                        formatDate(row[column].toString())
                      ) :
                      isBoolean(row[column]) ? (
                      <span className={row[column] ? 'green-icon' : 'red-icon'}>
                        {row[column] ? (
                          <span style={{ color: 'green' }}>✔</span>
                        ) : (
                          <span style={{ color: 'red' }}>✖</span>
                        )}
                      </span>
                      ) : row[column] == null ? (
                      <p>-</p>
                      ) : isNumber(row[column]) ? (
                      new Intl.NumberFormat().format(row[column])
                      ) : column === 'accountName' ? (
                      <span className={row.isLedgerAccount ? '' : styles.boldText}>
                        {row[column]}
                      </span>
                      ) : (
                      row[column]
                      )}
                    </TableCell>


                  )
                ))}
                {showMenu && (
                  <TableCell style={{ paddingTop: 0, paddingBottom: 0, textAlign: 'right' }}>
                    {(editAllowance && deleteAllowance) && <IconButton onClick={(event) => handleMenuClick(event, rowIndex)} aria-label="more" aria-controls="menu" aria-haspopup="true">
                      <MoreVert fontSize='small' />
                    </IconButton>}
                    <Menu
                      id="menu"
                      anchorEl={menuAnchorEl[rowIndex]}
                      open={Boolean(menuAnchorEl[rowIndex])}
                      onClose={() => closeMenu(rowIndex)}
                      MenuListProps={{
                        'aria-labelledby': 'fade-button',
                        className: styles.menuList,
                      }}
                      PaperProps={{
                        style: {
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                    >
                      {(editAllowance || deleteAllowance) && <IconButton onClick={(event) => { event.stopPropagation(); closeMenu(rowIndex); }} aria-label="close" className={styles.closeButton}>
                        <CloseIcon fontSize="small" />
                      </IconButton>}
                      {editAllowance && (
                        <MenuItem onClick={(event) => handleEditClick(rowIndex, event)}>
                          <Edit fontSize="small" color="primary" />
                          Edit
                        </MenuItem>
                      )}
                      {deleteAllowance && !nonDeleteAbleIds.includes(row.id) && (
                        <MenuItem onClick={(event) => handleDeleteClick(rowIndex, event)}>
                          <Delete fontSize="small" color="error" />
                          Delete
                        </MenuItem>
                      )}
                    </Menu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {tableData.length === 0 && <div className={styles.message}>{noDataMessage}</div>}
      </TableContainer>
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 2,
              outline: 'none',
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              style={{ position: 'absolute', top: 10, right: 10 }}
            >
              <CloseIcon color='warning' />
            </IconButton>
            {imageToShow && (
              <img
                src={imageToShow}
                alt="Modal Content"
                style={{ maxWidth: '100%', maxHeight: '90vh', display: 'block', margin: '0 auto' }}
              />
            )}
          </Box>
        </Modal>
      )}
      {paginator && tableData.length !== 0 && (
        <PaginatorComponent
          onPageSizeChange={handlePageSizeChange}
          pageIndex={currentPage - 1}
          pageSize={pageSize}
          totalSize={totalSize}
          onPageChange={onPageChange}
        />
      )}
      {editRowIndex !== null && (
        <DialogueComponent
          heading="Confirm Edit"
          question="Do you really want to edit this?"
          onClose={handleConfirmEdit}
        />
      )}
      {deleteRowIndex !== null && (
        <DialogueComponent
          heading="Confirm Delete"
          question="Do you really want to delete this?"
          onClose={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default TableComponent;
