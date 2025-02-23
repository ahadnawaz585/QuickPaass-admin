"use client";

import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  IconButton,
  Grid,
  Chip,
  useTheme,
} from "@mui/material";
import {
  Close,
  AccessTime,
  CheckCircle,
  Cancel,
  TimerOff,
  BeachAccess,
  TrendingUp,
} from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import AttendanceService from "@/modules/AMS/services/attendance.service";
import AttendanceDataGrid from "../../../Attendance/AttendanceDataGrid";
import { AttendanceStatus } from "@/modules/AMS/pages/attendance/attendance";
import '../../styles/AttendanceTab.scss';
import { useParams } from "next/navigation";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AttendanceTab = () => {
  const theme = useTheme();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>([]);
  const [activeFilter, setActiveFilter] = useState<AttendanceStatus | null>(null);
  const { id }: any = useParams();
  const employeeId: string = Array.isArray(id) ? id[0] : id;
  const [loading, setLoading] = useState<boolean>(true);
  const service = new AttendanceService();

  const [stats, setStats] = useState({
    totalPresents: 0,
    totalAbsents: 0,
    totalLates: 0,
    totalLeaves: 0,
    avgCheckIn: "00:00",
    avgCheckOut: "00:00",
    attendanceRate: 0,
    punctualityRate: 0
  });

  const fetchAttendances = async (from: Date | null, to: Date | null) => {
    try {
      setLoading(true);
      const data = await service.getEmployeeAttendances(employeeId, from, to);
      setAttendances(data);
      setFilteredAttendances(data);
      calculateStats(data);
    } catch (error) {
      console.error("Failed to fetch attendances:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Attendance[]) => {
    let presents = 0;
    let absents = 0;
    let lates = 0;
    let leaves = 0;
    let totalCheckIn = 0;
    let totalCheckOut = 0;

    data.forEach(att => {
      if (att.status === AttendanceStatus.PRESENT) presents++;
      if (att.status === AttendanceStatus.ABSENT) absents++;
      if (att.status === AttendanceStatus.LATE) lates++;
      if (att.status === AttendanceStatus.ON_LEAVE) leaves++;

      if (att.checkIn) totalCheckIn += new Date(att.checkIn).getHours() * 60 + new Date(att.checkIn).getMinutes();
      if (att.checkOut) totalCheckOut += new Date(att.checkOut).getHours() * 60 + new Date(att.checkOut).getMinutes();
    });

    const totalDays = data.length;
    const attendanceRate = ((presents + lates) / totalDays) * 100;
    const punctualityRate = (presents / (presents + lates)) * 100;

    const avgCheckInMinutes = totalCheckIn / data.length;
    const avgCheckOutMinutes = totalCheckOut / data.length;

    const avgCheckInHours = Math.floor(avgCheckInMinutes / 60);
    const avgCheckInRemainingMinutes = Math.round(avgCheckInMinutes % 60);
    const avgCheckOutHours = Math.floor(avgCheckOutMinutes / 60);
    const avgCheckOutRemainingMinutes = Math.round(avgCheckOutMinutes % 60);

    setStats({
      totalPresents: presents,
      totalAbsents: absents,
      totalLates: lates,
      totalLeaves: leaves,
      avgCheckIn: `${avgCheckInHours}:${avgCheckInRemainingMinutes < 10 ? '0' : ''}${avgCheckInRemainingMinutes}`,
      avgCheckOut: `${avgCheckOutHours}:${avgCheckOutRemainingMinutes < 10 ? '0' : ''}${avgCheckOutRemainingMinutes}`,
      attendanceRate: Math.round(attendanceRate),
      punctualityRate: Math.round(punctualityRate)
    });
  };

  const handleDateRangeChange = (fromDate: Date | null, toDate: Date | null) => {
    fetchAttendances(fromDate, toDate);
  };

  const handleStatClick = (status: AttendanceStatus) => {
    if (activeFilter === status) {
      setActiveFilter(null);
      setFilteredAttendances(attendances);
    } else {
      setActiveFilter(status);
      setFilteredAttendances(attendances.filter(att => att.status === status));
    }
  };

  const clearFilter = () => {
    setActiveFilter(null);
    setFilteredAttendances(attendances);
  };

  useEffect(() => {
    fetchAttendances(null, null);
  }, [employeeId]);

  const attendanceDistributionData = {
    labels: ['Present', 'Absent', 'Late', 'Leave'],
    datasets: [{
      data: [stats.totalPresents, stats.totalAbsents, stats.totalLates, stats.totalLeaves],
      backgroundColor: [
        theme.palette.success.main,
        theme.palette.error.main,
        theme.palette.warning.main,
        theme.palette.info.main
      ],
      borderWidth: 1,
    }],
  };

  const checkInTrendData = {
    labels: attendances.slice(-7).map(att => 
      new Date(att.date).toLocaleDateString('en-US', { weekday: 'short' })
    ),
    datasets: [{
      label: 'Check-in Time',
      data: attendances.slice(-7).map(att =>
        att.checkIn ? new Date(att.checkIn).getHours() +
          (new Date(att.checkIn).getMinutes() / 60) : null
      ),
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light,
      tension: 0.4,
      fill: true,
    }],
  };

  const monthlyTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Attendance Rate',
        data: [95, 92, 88, 94, 91, stats.attendanceRate],
        borderColor: theme.palette.success.main,
        backgroundColor: theme.palette.success.light,
        yAxisID: 'y',
      },
      {
        label: 'Punctuality Rate',
        data: [90, 88, 85, 92, 87, stats.punctualityRate],
        borderColor: theme.palette.info.main,
        backgroundColor: theme.palette.info.light,
        yAxisID: 'y',
      },
    ],
  };

  const statCards = [
    {
      title: 'Present',
      value: stats.totalPresents,
      icon: <CheckCircle sx={{ color: theme.palette.success.main }} />,
      status: AttendanceStatus.PRESENT,
      color: theme.palette.success.light,
    },
    {
      title: 'Absent',
      value: stats.totalAbsents,
      icon: <Cancel sx={{ color: theme.palette.error.main }} />,
      status: AttendanceStatus.ABSENT,
      color: theme.palette.error.light,
    },
    {
      title: 'Late',
      value: stats.totalLates,
      icon: <TimerOff sx={{ color: theme.palette.warning.main }} />,
      status: AttendanceStatus.LATE,
      color: theme.palette.warning.light,
    },
    {
      title: 'Leave',
      value: stats.totalLeaves,
      icon: <BeachAccess sx={{ color: theme.palette.info.main }} />,
      status: AttendanceStatus.ON_LEAVE,
      color: theme.palette.info.light,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Attendance Dashboard
          {activeFilter && (
            <IconButton onClick={clearFilter} size="small" sx={{ ml: 1 }}>
              <Close fontSize="small"/>
            </IconButton>
          )}
        </Typography>
        <Box>
          <Chip 
            icon={<TrendingUp />} 
            label={`Attendance Rate: ${stats.attendanceRate}%`} 
            color="success" 
            sx={{ mr: 1 }}
          />
          <Chip 
            icon={<AccessTime />} 
            label={`Punctuality Rate: ${stats.punctualityRate}%`} 
            color="primary" 
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Stat Cards */}
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              onClick={() => stat.status && handleStatClick(stat.status)}
              sx={{
                cursor: 'pointer',
                bgcolor: activeFilter === stat.status ? stat.color : 'background.paper',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {stat.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Time Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Avg. Check-in
                </Typography>
              </Box>
              <Typography variant="h4">{stats.avgCheckIn}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime color="secondary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Avg. Check-out
                </Typography>
              </Box>
              <Typography variant="h4">{stats.avgCheckOut}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}


                {/* Attendance Grid */}
                <Grid item xs={12}>
          <Paper sx={{ p: 3, position: 'relative' }}>
            <Typography variant="h6" gutterBottom>
              Detailed Attendance Records
            </Typography>
            <AttendanceDataGrid
              showExtras={false}
              attendances={filteredAttendances}
              onDateRangeChange={handleDateRangeChange}
            />
            {loading && (
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.7)',
              }}>
                <CircularProgress />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Attendance Distribution
            </Typography>
            <Box sx={{ height: 'calc(100% - 40px)' }}>
              <Doughnut
                data={attendanceDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { padding: 20, usePointStyle: true },
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Check-in Time Trend (Last 7 Days)
            </Typography>
            <Box sx={{ height: 'calc(100% - 40px)' }}>
              <Line
                data={checkInTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      min: 6,
                      max: 12,
                      title: { display: true, text: 'Hour of Day' },
                    },
                  },
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

     

        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Monthly Attendance & Punctuality Trends
            </Typography>
            <Box sx={{ height: 'calc(100% - 40px)' }}>
              <Bar
                data={monthlyTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      min: 0,
                      max: 100,
                      title: { display: true, text: 'Percentage (%)' },
                    },
                  },
                  plugins: {
                    legend: { position: 'bottom' },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

   
      </Grid>
    </Box>
  );
};

export default AttendanceTab;