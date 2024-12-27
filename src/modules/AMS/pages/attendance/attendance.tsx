"use client"
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tab,
  Tabs,
  Alert,
  Snackbar,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import QRScanner from './component/QRScanner';
import ManualAttendance from './component/ManualAttendance';
import AttendanceService from '../../services/attendance.service';
import EmployeeService from '../../services/employee.service';
export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    LATE = 'LATE',
    HALF_DAY = 'HALF_DAY'
  }
  
  export interface Attendance {
    id?: string;
    employeeId: string;
    date: Date;
    status: AttendanceStatus;
    checkIn?: any;
    checkOut?: any;
    location?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: Date;
  }
import './styles/AttendancePage.scss';

const attendanceService = new AttendanceService();
const employeeService = new EmployeeService();

type NotificationType = {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
};

const AttendancePage: React.FC = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState<NotificationType>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadAttendances();
  }, []);

  const loadAttendances = async () => {
    try {
      const data = await attendanceService.getAllAttendances();
      setAttendances(data);
    } catch (error) {
      showNotification('Error loading attendances', 'error');
    }
  };

  const handleScanSuccess = async (employeeId: string) => {
    try {
      const employee = await employeeService.getEmployeeById(employeeId);
      if (employee) {
        const attendance: Attendance = {
          id: '', // Use a unique ID generator if required
          employeeId,
          date: new Date(),
          status: AttendanceStatus.PRESENT,
          checkIn: new Date(),
          checkOut: null,
          location: '',

        };
        await attendanceService.createAttendance(attendance);
        showNotification('Attendance marked successfully', 'success');
        loadAttendances();
      }
    } catch (error) {
      showNotification('Error marking attendance', 'error');
    }
  };

  const handleManualAttendance = async (
    employeeId: string,
    status: AttendanceStatus,
    date: Date
  ) => {
    try {
      const employee = await employeeService.getEmployeeById(employeeId);
      if (employee) {
        const attendance: Attendance = {
          id: '', // Use a unique ID generator if required
          employeeId,
          date,
          status,
          checkIn: status === AttendanceStatus.PRESENT ? date : null,
          checkOut: null,
          location: ''
        };
        await attendanceService.createAttendance(attendance);
        showNotification('Attendance marked successfully', 'success');
        loadAttendances();
      }
    } catch (error) {
      showNotification('Error marking attendance', 'error');
    }
  };

  const showNotification = (
    message: string,
    severity: 'success' | 'error' = 'success'
  ) => {
    setNotification({ open: true, message, severity });
  };

  const columns: GridColDef[] = [
    { field: 'employeeId', headerName: 'Employee ID', width: 130 },
    {
      field: 'employeeName',
      headerName: 'Employee Name',
      width: 200,
      valueGetter: (params: any) =>
        `${params.row.employee.name} ${params.row.employee.surname}`,
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 130,
      valueGetter: (params: any) =>
        dayjs(params.row.date).format('DD/MM/YYYY'),
    },
    { field: 'status', headerName: 'Status', width: 130 },
    {
      field: 'checkIn',
      headerName: 'Check In',
      width: 130,
      valueGetter: (params: any) =>
        params.row.checkIn ? dayjs(params.row.checkIn).format('HH:mm:ss') : '-',
    },
    {
      field: 'checkOut',
      headerName: 'Check Out',
      width: 130,
      valueGetter: (params: any) =>
        params.row.checkOut
          ? dayjs(params.row.checkOut).format('HH:mm:ss')
          : '-',
    },
  ];

  return (
    <Box className="attendance-page">
      <Typography variant="h4" className="header">
        Attendance Management
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="QR Scanner" />
          <Tab label="Manual Entry" />
        </Tabs>

        <Box p={3}>
          {activeTab === 0 ? (
            <QRScanner onScanSuccess={handleScanSuccess} />
          ) : (
            <ManualAttendance onSubmit={handleManualAttendance} />
          )}
        </Box>
      </Paper>

      <Paper className="attendance-grid">
        <DataGrid
          rows={attendances}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() =>
          setNotification({ ...notification, open: false })
        }
      >
        <Alert
          onClose={() =>
            setNotification({ ...notification, open: false })
          }
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AttendancePage;
