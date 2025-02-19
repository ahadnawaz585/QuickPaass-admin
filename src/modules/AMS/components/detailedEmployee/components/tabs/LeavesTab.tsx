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
} from '@mui/material';
import {
  Timeline,
  CalendarMonth,
  HourglassEmpty,
  CheckCircle,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import LeaveReqService from '@/modules/AMS/services/leaveReq.service';
import LeaveAllocService from '@/modules/AMS/services/leaveAlloc.service';
import { LeaveRequest, LeaveAllocation } from '@/types/AMS/leave';
import '../../styles/LeaveTab.scss';
import { formatDate } from '@/utils/date';

const LeavesTab = () => {
  const { id }: any = useParams();
  const employeeId: string = Array.isArray(id) ? id[0] : id;

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveAllocation, setLeaveAllocation] = useState<LeaveAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  const leaveReqService = new LeaveReqService();
  const leaveAllocService = new LeaveAllocService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requests, allocations] = await Promise.all([
          leaveReqService.getLeaveRequestsByEmployeeId(employeeId),
          leaveAllocService.getAllLeaveAllocationsByEmployeeId(employeeId),
        ]);

        setLeaveRequests(requests);
        setLeaveAllocation(allocations);
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
      { name: 'Approved', value: approved, color: '#4caf50' },
      { name: 'Pending', value: pending, color: '#ff9800' },
      { name: 'Rejected', value: rejected, color: '#f44336' },
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
    <div className="leaves-dashboard">
      {/* Stats Cards */}
      <div className="stats-cards">
          {/* <Card className="stat-card">
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonth color="primary" />
                <Typography variant="h6">Total Leave Balance</Typography>
              </Box>
              <Typography variant="h4" mt={2}>
                {leaveAllocation?.assignedDays || 0} days
              </Typography>
            </CardContent>
          </Card> */}

        {/* <Card className="stat-card">
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              <CheckCircle color="success" />
              <Typography variant="h6">Used Leaves</Typography>
            </Box>
            <Typography variant="h4" mt={2}>
              {leaveAllocation?.assignedDays || 0} days
            </Typography>
          </CardContent>
        </Card> */}

        <Card className="stat-card">
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              <HourglassEmpty color="warning" />
              <Typography variant="h6">Pending Requests</Typography>
            </Box>
            <Typography variant="h4" mt={2}>
              {leaveRequests.filter(r => r.status === 'PENDING').length}
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Leave Statistics Chart */}
      <Box className="chart-container">
        <Typography variant="h6" mb={2}>Leave Statistics</Typography>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={calculateLeaveStats()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Leave History Table */}
      <Box className="leave-history">
        <Typography variant="h6" mb={2}>Leave Requests</Typography>
        <TableContainer component={Paper}>
          <Table>
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
                      (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)
                    )}{' '}
                    days
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
      </Box>
    </div>
  );
};

export default LeavesTab;