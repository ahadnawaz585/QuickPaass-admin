import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Search, Close, ExpandMore, Edit } from '@mui/icons-material';
import { format, isValid } from 'date-fns';
import AttendanceService from '../../services/attendance.service';
import './AttendanceDataGrid.scss';
import { formatDate, formatTime } from '@/utils/date';

interface Attendance {
  id?: string;
  employeeId: string;
  date: Date;
  status: string;
  checkIn?: Date | null;
  checkOut?: Date | null;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date | undefined;
  isDeleted?: Date | undefined;
  employeeName: string;
  employeeSurname: string;
  designation: string;
  code?: string;
}

enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  ON_LEAVE = 'ON_LEAVE'
}

interface AttendanceDataGridProps {
  attendances: Attendance[];
  showExtras?: boolean;
  onRowClick?: (params: any) => void;
  onDateRangeChange: (fromDate: Date | null, toDate: Date | null) => void;
}

const AttendanceDataGrid: React.FC<AttendanceDataGridProps> = ({
  attendances,
  showExtras = true,
  onRowClick,
  onDateRangeChange,
}) => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<AttendanceStatus>(AttendanceStatus.PRESENT);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  
  const attendanceService = new AttendanceService();

  const handleEditClick = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setNewStatus(attendance.status as AttendanceStatus);
    setCheckInTime(attendance.checkIn ? new Date(attendance.checkIn) : null);
    setCheckOutTime(attendance.checkOut ? new Date(attendance.checkOut) : null);
    setOpenDialog(true);
  };
  const handleUpdateAttendance = async () => {
    if (selectedAttendance && selectedAttendance.id) {
      try {
        const updatedAttendance = {
          status: newStatus,
          checkIn: newStatus === AttendanceStatus.PRESENT ? checkInTime : null,
          checkOut: newStatus === AttendanceStatus.PRESENT ? checkOutTime : null,
          updatedAt: new Date(),
          employeeId: selectedAttendance.employeeId,
          date: selectedAttendance.date,
        };
  
        await attendanceService.updateAttendance(selectedAttendance.id, updatedAttendance);
  
        setOpenDialog(false);
        onDateRangeChange(fromDate, toDate);
      } catch (error) {
        console.error('Error updating attendance:', error);
      }
    }
  };
  

  const formatDateValue = (value: any): string => {
    if (!value) return '-';
    try {
      const date = new Date(value);
      return isValid(date) ? format(date, 'dd/MM/yyyy') : '-';
    } catch {
      return '-';
    }
  };

  const formatTimeValue = (value: any): string => {
    if (!value) return '-';
    try {
      const date = new Date(value);
      return isValid(date) ? format(date, 'HH:mm:ss') : '-';
    } catch {
      return '-';
    }
  };

  const columns = [
    ...(showExtras
      ? [
          { field: 'code', headerName: 'Employee Code', width: 180 },
          { field: 'employeeName', headerName: 'First Name', width: 150 },
          { field: 'employeeSurname', headerName: 'Last Name', width: 150 },
          { field: 'designation', headerName: 'Designation', width: 150 },
        ]
      : []),
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'date',
      headerName: 'Date',
      width: 130,
      renderCell: (params: any) => formatDate(params.value),
    },
    {
      field: 'checkIn',
      headerName: 'Check In',
      width: 130,
      renderCell: (params: any) => formatTime(params.value),
    },
    {
      field: 'checkOut',
      headerName: 'Check Out',
      width: 130,
      renderCell: (params: any) => formatTime(params.value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params: any) => (
        <Button
        size="small"
        onClick={(event) => {
          event.stopPropagation(); // Stop the event from propagating to parent elements
          handleEditClick(params.row); // Call the edit handler
        }}
        startIcon={<Edit />}
      >
        Edit
      </Button>
      
      ),
    },
  ];

  const handleDiscardFilters = () => {
    setFromDate(null);
    setToDate(null);
    onDateRangeChange(null, null);
  };

  return (
    <div className="attendance-grid">
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <div>Filters</div>
        </AccordionSummary>
        <AccordionDetails>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="filters">
              <div className="date-pickers">
                <DatePicker
                  label="From Date"
                  value={fromDate}
                  onChange={setFromDate}
                  views={['day', 'month', 'year']}
                                format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                    },
                  }}
                />
                <DatePicker
                  label="To Date"
                  value={toDate}
                  onChange={setToDate}
                  views={['day', 'month', 'year']}
                                format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                    },
                  }}
                />
              </div>
              <div className="filter-buttons">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onDateRangeChange(fromDate, toDate)}
                  startIcon={<Search />}
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDiscardFilters}
                  startIcon={<Close />}
                >
                  Clear
                </Button>
              </div>
            </div>
          </LocalizationProvider>
        </AccordionDetails>
      </Accordion>

      <DataGrid
        rows={attendances}
        columns={columns}
        onRowClick={onRowClick}
        autoHeight
        checkboxSelection
        disableRowSelectionOnClick
        initialState={{
          density: 'compact',
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        slotProps={{ toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
      }}}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'even'
      }
      slots={{ toolbar: GridToolbar}}
        pageSizeOptions={[5, 10, 25, 50,100]}
      />

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Attendance</DialogTitle>
        <DialogContent>
          {selectedAttendance && (
            <div className="dialog-content">
              <div className="employee-info">
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Employee:</strong> {selectedAttendance.employeeName} {selectedAttendance.employeeSurname}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Designation:</strong> {selectedAttendance.designation}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Date:</strong> {formatDateValue(selectedAttendance.date)}
                </Typography>
              </div>

              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AttendanceStatus)}
                  label="Status"
                >
                  {Object.values(AttendanceStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {newStatus  == AttendanceStatus.PRESENT && <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="time-pickers">
                  <TimePicker
                    label="Check In Time"
                    value={checkInTime}
                    onChange={setCheckInTime}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "normal",
                      },
                    }}
                  />
                  <TimePicker
                    label="Check Out Time"
                    value={checkOutTime}
                    onChange={setCheckOutTime}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "normal",
                      },
                    }}
                  />
                </div>
              </LocalizationProvider>}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateAttendance} color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AttendanceDataGrid;