"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tab,
  Tabs,
  Alert,
  Snackbar,
} from "@mui/material";
import { formatDate, formatTime } from "@/utils/date";
import { DataGrid, GridColDef ,GridToolbar} from "@mui/x-data-grid";
import dayjs from "dayjs";
import QRScanner from "./component/QRScanner";
import ManualAttendance from "./component/ManualAttendance";
import AttendanceService from "../../services/attendance.service";
import EmployeeService from "../../services/employee.service";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DialogueComponent from "@/components/shared/dialogue/dialogue";

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  ON_LEAVE = 'ON_LEAVE',
}

export interface Attendance {
  id?: string;
  employeeId: string;
  date: Date;
  status: AttendanceStatus;
  checkIn?: Date | null;
  checkOut?: Date | null;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date | undefined;
  isDeleted?: Date | undefined;
  employeeName: string;
  employeeSurname: string;
  designation: string;
}

import { useRouter } from "next/navigation";
import "./styles/AttendancePage.scss";

const attendanceService = new AttendanceService();
const employeeService = new EmployeeService();

type NotificationType = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

const AttendancePage: React.FC = () => {
  const router = useRouter();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState<NotificationType>({
    open: false,
    message: "",
    severity: "success",
  });
  const [dialogProps, setDialogProps] = useState({
    open: false,
    heading: "",
    question: "",
    onClose: (confirm: boolean) => {},
  });

  useEffect(() => {
    loadAttendances();
  }, []);

  const loadAttendances = async () => {
    try {
      const data: any = await attendanceService.getAllAttendances();
      setAttendances(data);
    } catch (error) {
      showNotification("Error loading attendances", "error");
    }
  };

  const handleScanSuccess = async (employeeId: string) => {
    try {
      // Call the checkAttendance API to get attendance status
      const response = await attendanceService.checkAttendance(employeeId,AttendanceStatus.PRESENT);
      const { success, message }:any = response.data;

      if (success) {
        // Show dialog with attendance status
        setDialogProps({
          open: true,
          heading: "Attendance Status",
          question: `${message}`,
          onClose: async (confirm) => {
            setDialogProps({ ...dialogProps, open: false });
            if (confirm) {
              const employee = await employeeService.getEmployeeById(employeeId);
              if (employee) {
                const attendance: Attendance = {
                  employeeId,
                  date: new Date(),
                  status: AttendanceStatus.PRESENT,
                  checkIn: new Date(),
                  checkOut: undefined,
                  location: "",
                  employeeName: employee.name,
                  employeeSurname: employee.surname,
                  designation: employee.designation,
                };
                await attendanceService.createAttendance(attendance);
                showNotification("Attendance marked successfully", "success");
                loadAttendances();
              }
            }
          },
        });
      }
    } catch (error) {
      showNotification("Error checking attendance", "error");
    }
  };

  const handleManualAttendance = async (
    employeeId: string,
    status: AttendanceStatus,
    date: Date
  ) => {
    try {
      // Call the checkAttendance API to check current attendance status
      const response = await attendanceService.checkAttendance(employeeId,status);
      const { success, message }:any = response.data;

      if (success) {
        // Show dialog with the current attendance status before marking
        setDialogProps({
          open: true,
          heading: "Confirm Attendance",
          question: `${message}`,
          onClose: async (confirm) => {
            setDialogProps({ ...dialogProps, open: false });
            if (confirm) {
              const employee = await employeeService.getEmployeeById(employeeId);
              if (employee) {
                const attendance: any = {
                  employeeId,
                  date,
                  status,
                  checkIn: status === AttendanceStatus.PRESENT ? date : null,
                  checkOut: null,
                  location: "",
                };
                await attendanceService.markAttendance(attendance);
                showNotification("Attendance marked successfully", "success");
                loadAttendances();
              }
            }
          },
        });
      }

    } catch (error) {
      showNotification("Error marking attendance", "error");
    }
  };

  const showNotification = (
    message: string,
    severity: "success" | "error" = "success"
  ) => {
    setNotification({ open: true, message, severity });
  };

  const handleRowClick = (params: any) => {
    const selectedAttendance = params.row;
    router.push(`/admin/ams/employee/${selectedAttendance.employeeId}`);
  };

  const columns: GridColDef[] = [
    { field: "code", headerName: "Employee Code", width: 180 },
    { field: "employeeName", headerName: "First Name", width: 150 },
    { field: "employeeSurname", headerName: "Last Name", width: 150 },
    { field: "designation", headerName: "Designation", width: 150 },
    { field: "department", headerName: "Department", width: 150 },
    { field: "contactNo", headerName: "Contact", width: 150 },
    { field: "address", headerName: "Address", width: 350 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "date",
      headerName: "Date",
      width: 130,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "checkIn",
      headerName: "Check In",
      width: 130,
      renderCell: (params) => formatTime(params.value),
    },
    {
      field: "checkOut",
      headerName: "Check Out",
      width: 130,
      renderCell: (params) => formatTime(params.value),
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <Box className="attendance-page">
          <Typography variant="h4" className="header">
            Attendance Management
          </Typography>

          <Paper sx={{ width: "100%", mb: 2 }}>
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
                <ManualAttendance
                  onSubmit={handleManualAttendance}
                />
              )}
            </Box>
          </Paper>

          <Paper className="attendance-grid">
            <DataGrid
              rows={attendances}
              columns={columns}
              onRowClick={handleRowClick}
              slotProps={{
                loadingOverlay: {
                  variant: 'skeleton',
                  noRowsVariant: 'skeleton',
                },
              }}
              slots={{ toolbar: GridToolbar}}
              initialState={{
                density: 'compact',
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
            onClose={() => setNotification({ ...notification, open: false })}
          >
            <Alert
              onClose={() => setNotification({ ...notification, open: false })}
              severity={notification.severity}
              sx={{ width: "100%" }}
            >
              {notification.message}
            </Alert>
          </Snackbar>

          {/* Confirmation Dialog */}
          {dialogProps.open && (
            <DialogueComponent
              heading={dialogProps.heading}
              question={dialogProps.question}
              onClose={dialogProps.onClose}
            />
          )}
        </Box>
      </>
    </LocalizationProvider>
  );
};

export default AttendancePage;
