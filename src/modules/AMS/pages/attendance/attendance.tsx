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
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import AttendanceDataGrid from "@/modules/AMS/components/Attendance/AttendanceDataGrid";
import _ from 'lodash';
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import "./attendancePage.scss";
import { convertToUTC } from "../../helper/date.helper";

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
    onClose: (confirm: boolean) => { },
  });

  const [stats, setStats] = useState({
    totalEmployees: 0,
    present: 0,
    absent: 0,
    late: 0,
    onLeave: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      await loadAttendances();

    };

    fetchData();
  }, []);

  useEffect(() => {
    loadStats();
  }, [stats.totalEmployees]);

  const loadAttendances = async () => {
    try {
      const data: any = await attendanceService.getAllAttendances();
      setAttendances(data);
      await loadStats();
    } catch (error) {
      showNotification("Error loading attendances", "error");
    }
  };

  const loadStats = async () => {
    try {
      const totalEmployees = await employeeService.getTotalEmployees();
      const present = attendances.filter(a => a.status === AttendanceStatus.PRESENT).length;
      const late = attendances.filter(a => a.status === AttendanceStatus.LATE).length;
      const onLeave = attendances.filter(a => a.status === AttendanceStatus.ON_LEAVE).length;
      const absent = attendances.filter(a => a.status === AttendanceStatus.ABSENT).length;
      const pending = totalEmployees - (present + late + onLeave + absent);
      setStats({
        totalEmployees,
        present,
        absent,
        late,
        onLeave,
        pending
      });
    } catch (error) {
      showNotification("Error loading stats", "error");
    }
  };

  const handleStatClick = async (status: AttendanceStatus | 'ALL') => {
    console.log('Filtering for status:', status);

    try {
      // Always load fresh attendances from the server
      const latestAttendances: any = await attendanceService.getAllAttendances();

      if (_.isEmpty(latestAttendances)) {
        console.error('No attendances loaded:', latestAttendances);
        setAttendances([]); // Clear attendances if none exist
        return;
      }

      if (status === 'ALL') {
        setAttendances(latestAttendances); // Show all attendances
      } else {
        const filteredAttendances = _.filter(latestAttendances, a => a.status === status);
        // console.log('Filtered attendances:', filteredAttendances);
        setAttendances(filteredAttendances);
      }
    } catch (error) {
      console.error('Error loading or filtering attendances:', error);
      showNotification('Error loading attendances', 'error');
    }
  };




  const handleScanSuccess = async (employeeId: string) => {
    try {
      // Call the checkAttendance API to get attendance status
      const response = await attendanceService.checkAttendance(employeeId, AttendanceStatus.PRESENT, new Date());
      const { success, message }: any = response.data;

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

  const handleDateRangeChange = async (fromDate: Date | null, toDate: Date | null) => {
    const utcFromDate = fromDate ? convertToUTC(fromDate) : null;
    const utcToDate = toDate ? convertToUTC(toDate) : null;
    // You can now filter the data or fetch data based on the date range
    // Example: filter the attendances
    // const filteredAttendances = attendances.filter((attendance) => {
    //   const attendanceDate = new Date(attendance.date);
    //   if (fromDate && attendanceDate < fromDate) return false;
    //   if (toDate && attendanceDate > toDate) return false;
    //   return true;
    // });
    if (fromDate || toDate) {
      const filtered = await attendanceService.getDatedAttendances(utcFromDate, utcToDate);
      setAttendances(filtered);
      showNotification("Filtered Attendance fetched", "success");
    } else{
      loadAttendances();
    }
  };

  const handleManualAttendance = async (
    employeeId: string,
    status: AttendanceStatus,
    date: Date
  ) => {
    try {
      if (!(date instanceof Date)) {
        showNotification("Invalid date provided for attendance", "error");
        return;
      }
  
      // Convert to UTC
      const utcDate = convertToUTC(date);
  
      // Call the API
      const response = await attendanceService.checkAttendance(employeeId, status, utcDate);
      const { success, message }: any = response.data;
  
      if (success) {
        setDialogProps({
          open: true,
          heading: "Confirm Attendance",
          question: `${message}`,
          onClose: async (confirm: boolean) => {
            setDialogProps({ ...dialogProps, open: false });
            if (confirm) {
              const attendance = {
                employeeId,
                date: utcDate,
                status,
                checkIn: status === AttendanceStatus.PRESENT ? utcDate : null,
                checkOut: null,
                location: "",
              };
  
              await attendanceService.markAttendance(attendance);
              showNotification("Attendance marked successfully", "success");
              loadAttendances();
            }
          },
        });
      } else {
        showNotification(message || "Attendance check failed", "error");
      }
    } catch (error) {
      console.error("Error handling manual attendance:", error);
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <Box className="attendance-page">
          <Typography variant="h4" className="header">
            Attendance Management
          </Typography>
          <Grid container spacing={2} className="stat-cards">
            <Grid item xs={12} sm={4} md={2} mb={5}>
              <Card className="stat-card all" onClick={() => handleStatClick('ALL')}>
                <CardContent>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h4">{stats.totalEmployees}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <Card className="stat-card present" onClick={() => handleStatClick(AttendanceStatus.PRESENT)}>
                <CardContent>
                  <Typography variant="h6">Present</Typography>
                  <Typography variant="h4">{stats.present}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <Card className="stat-card absent" onClick={() => handleStatClick(AttendanceStatus.ABSENT)}>
                <CardContent>
                  <Typography variant="h6">Absent</Typography>
                  <Typography variant="h4">{stats.absent}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <Card className="stat-card late" onClick={() => handleStatClick(AttendanceStatus.LATE)}>
                <CardContent>
                  <Typography variant="h6">Late</Typography>
                  <Typography variant="h4">{stats.late}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <Card className="stat-card on-leave" onClick={() => handleStatClick(AttendanceStatus.ON_LEAVE)}>
                <CardContent>
                  <Typography variant="h6">On Leave</Typography>
                  <Typography variant="h4">{stats.onLeave}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <Card className="stat-card pending">
                <CardContent>
                  <Typography variant="h6">Pending</Typography>
                  <Typography variant="h4">{stats.pending}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Accordion className="accordion"  
           aria-controls="panel1a-content"
          id="panel1a-header"> 
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Mark Attendance</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box className="tabs-container">
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
              </Box>
            </AccordionDetails>
          </Accordion>

          <Paper className="attendance-grid">
            <AttendanceDataGrid onDateRangeChange={handleDateRangeChange} onRowClick={handleRowClick} attendances={attendances} />
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
