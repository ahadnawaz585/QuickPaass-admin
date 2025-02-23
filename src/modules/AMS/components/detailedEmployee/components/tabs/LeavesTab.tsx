"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  CalendarMonth,
  EventBusy,
  CheckCircle,
  HourglassEmpty,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import LeaveReqService from '@/modules/AMS/services/leaveReq.service';
import LeaveAllocService from '@/modules/AMS/services/leaveAlloc.service';
import { LeaveRequest, LeaveAllocation } from '@/types/AMS/leave';
import { formatDate } from '@/utils/date';
import AttendanceService from '@/modules/AMS/services/attendance.service';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const LeavesTab = () => {
  const { id }: any = useParams();
  const employeeId: string = Array.isArray(id) ? id[0] : id;

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveAllocation, setLeaveAllocation] = useState<LeaveAllocation[]>([]);
  const [attendances, setAttendances] = useState<{date: String}[]>([]);
  const [loading, setLoading] = useState(true);

  const leaveReqService = new LeaveReqService();
  const leaveAllocService = new LeaveAllocService();
  const attendanceService = new AttendanceService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requests, allocations, attendances] = await Promise.all([
          leaveReqService.getLeaveRequestsByEmployeeId(employeeId),
          leaveAllocService.getAllLeaveAllocationsByEmployeeId(employeeId),
          attendanceService.getSpecificAttendances(employeeId, 'ON_LEAVE')
        ]);

        setLeaveRequests(requests);
        setLeaveAllocation(allocations);
        setAttendances(attendances);
      } catch (error) {
        console.error('Error fetching leave data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const calculateLeaveStats = () => {
    const approved = leaveRequests.filter(r => r.status === 'APPROVED').length;
    const pending = leaveRequests.filter(r => r.status === 'PENDING').length;
    const rejected = leaveRequests.filter(r => r.status === 'REJECTED').length;

    return [
      { name: 'Approved', value: approved, color: '#00C49F' },
      { name: 'Pending', value: pending, color: '#FFBB28' },
      { name: 'Rejected', value: rejected, color: '#FF8042' }
    ];
  };

  const calculateLeaveBalance = () => {
    const totalAllocated = leaveAllocation.reduce((sum, allocation) => 
      sum + allocation.assignedDays, 0);
    const totalUsed = attendances.length;
    const remaining = totalAllocated - totalUsed;

    return [
      { name: 'Used', value: totalUsed, color: '#0088FE' },
      { name: 'Remaining', value: remaining, color: '#00C49F' }
    ];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <CalendarMonth color="primary" />
                <Typography variant="h6">Total Allocated</Typography>
              </Box>
              <Typography variant="h4">
                {leaveAllocation.reduce((sum, allocation) => 
                  sum + allocation.assignedDays, 0)} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <CheckCircle color="success" />
                <Typography variant="h6">Used Leaves</Typography>
              </Box>
              <Typography variant="h4">
                {attendances.length} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <EventBusy color="info" />
                <Typography variant="h6">Remaining</Typography>
              </Box>
              <Typography variant="h4">
                {leaveAllocation.reduce((sum, allocation) => 
                  sum + allocation.assignedDays, 0) - attendances.length} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <HourglassEmpty color="warning" />
                <Typography variant="h6">Pending</Typography>
              </Box>
              <Typography variant="h4">
                {leaveRequests.filter(r => r.status === 'PENDING').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '400px', p: 2 }}>
            <Typography variant="h6" mb={2}>Leave Balance</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={calculateLeaveBalance()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {calculateLeaveBalance().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '400px', p: 2 }}>
            <Typography variant="h6" mb={2}>Leave Request Status</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={calculateLeaveStats()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {calculateLeaveStats().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Tables */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Leave Requests History</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveRequests.map((request, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(new Date(request.startDate).toLocaleDateString())}</TableCell>
                        <TableCell>{formatDate(new Date(request.endDate).toLocaleDateString())}</TableCell>
                        <TableCell>{request.reason}</TableCell>
                        <TableCell>
                          {Math.ceil(
                            (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / 
                            (1000 * 60 * 60 * 24)
                          )} days
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={request.status}
                            color={getStatusColor(request.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{request.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Leave Allocations</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Assigned Days</TableCell>
                      <TableCell>Leave Type</TableCell>
                      <TableCell>Note</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveAllocation.map((allocation, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(allocation.allocationStartDate.toString())}</TableCell>
                        <TableCell>{formatDate(allocation.allocationEndDate?.toString() || '')}</TableCell>
                        <TableCell>{allocation.assignedDays}</TableCell>
                        <TableCell>{allocation?.leaveConfig?.name || '-'}</TableCell>
                        <TableCell>{allocation.note || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Leaves Taken</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendances.map((attendance, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(attendance.date.toString())}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeavesTab;