import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import {Close} from "@mui/icons-material"
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
import { Line, Doughnut } from 'react-chartjs-2';
import AttendanceService from "@/modules/AMS/services/attendance.service";
import AttendanceDataGrid, { Attendance } from "../../../Attendance/AttendanceDataGrid";
import { AttendanceStatus } from "@/modules/AMS/pages/attendance/attendance";
import '../../styles/AttendanceTab.scss';

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
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>([]);
  const [activeFilter, setActiveFilter] = useState<AttendanceStatus | null>(null);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const service = new AttendanceService();

  const [stats, setStats] = useState({
    totalPresents: 0,
    totalAbsents: 0,
    totalLates: 0,
    totalLeaves: 0,
    avgCheckIn: "00:00",
    avgCheckOut: "00:00"
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

  const handleDateRangeChange = (fromDate: Date | null, toDate: Date | null) => {
    fetchAttendances(fromDate, toDate);
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
    });
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
      backgroundColor: ['#4CAF50', '#f44336', '#ff9800', '#2196f3'],
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
      borderColor: '#2196f3',
      tension: 0.4,
    }],
  };

  const handleRowClick = (params: any) => {
    console.log("Row clicked:", params);
  };

  const statItems = [
    { title: 'Total Presents', value: stats.totalPresents, status: AttendanceStatus.PRESENT },
    { title: 'Total Absents', value: stats.totalAbsents, status: AttendanceStatus.ABSENT },
    { title: 'Total Lates', value: stats.totalLates, status: AttendanceStatus.LATE },
    { title: 'Total Leaves', value: stats.totalLeaves, status: AttendanceStatus.ON_LEAVE },
    { title: 'Average Check In', value: stats.avgCheckIn },
    { title: 'Average Check Out', value: stats.avgCheckOut },
  ];

  return (
    <div className="attendance-container">
      <Box className="attendance-header">
        <Typography variant="h4" component="h1">
          Attendance Report
          {activeFilter && (
            <IconButton 
              onClick={clearFilter}
              size="small"
              className="clear-filter-btn"
            >
              <Close fontSize="small"/>
            </IconButton>
          )}
        </Typography>
      </Box>

      <div className="attendance-content">
        <div className="attendance-main">
        <div className="attendance-stats">
            {statItems.map((stat, index) => (
              <Card 
                key={index} 
                className={`stat-item ${stat.status && activeFilter === stat.status ? 'active' : ''}`}
                onClick={() => stat.status && handleStatClick(stat.status)}
                style={{ cursor: stat.status ? 'pointer' : 'default' }}
              >
                <CardContent>
                  <Typography className="stat-title">
                    {stat.title}
                  </Typography>
                  <Typography className="stat-value">
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
          <Paper className="attendance-data-grid">
            <AttendanceDataGrid
              showExtras={false}
              attendances={filteredAttendances}
              onRowClick={handleRowClick}
              onDateRangeChange={handleDateRangeChange}
            />
            {loading && (
              <Box className="loading-overlay">
                <CircularProgress />
              </Box>
            )}
          </Paper>

       

          <div className="charts-section">
            <Paper className="chart-wrapper">
              <Typography variant="h6" gutterBottom>
                Attendance Distribution
              </Typography>
              <Doughnut
                data={attendanceDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                      },
                    },
                  },
                }}
              />
            </Paper>

            <Paper className="chart-wrapper">
              <Typography variant="h6" gutterBottom>
                Check-in Time Trend (Last 7 Days)
              </Typography>
              <Line
                data={checkInTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    y: {
                      min: 6,
                      max: 12,
                      title: {
                        display: true,
                        text: 'Hour of Day',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTab;